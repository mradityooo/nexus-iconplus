
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const activeStatuses = ["PENDING", "APPROVED"] as const;

function isDatabaseError(
  error: unknown
): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

// GET: Menampilkan daftar reservasi
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const isGA =
      session.user.role === "GA" ||
      session.user.role === "ADMIN";

    const reservations = await prisma.vehicleReservation.findMany({
      where: isGA
        ? {}
        : {
            employee: {
              userId: session.user.id,
            },
          },
      include: {
        employee: {
          select: {
            employeeCode: true,
            fullName: true,
            department: true,
            position: true,
          },
        },
        vehicle: true,
        driver: true,
        approvedBy: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Data reservasi berhasil diambil.",
      data: reservations,
    });
  } catch (error) {
    console.error("GET /api/reservations:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data reservasi." },
      { status: 500 }
    );
  }
}

// POST: Mengajukan reservasi kendaraan
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Format data tidak valid." },
        { status: 400 }
      );
    }

    const allowedFields = [
      "vehicleId",
      "driverId",
      "startAt",
      "endAt",
      "destination",
      "purpose",
      "passengerCount",
    ];

    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some((key) => !allowedFields.includes(key))
    ) {
      return NextResponse.json(
        { message: "Data pengajuan tidak valid." },
        { status: 400 }
      );
    }

    // Validasi input dasar
    const vehicleId =
      typeof body.vehicleId === "string"
        ? body.vehicleId.trim()
        : "";

    const driverId =
      body.driverId === undefined ||
      body.driverId === null ||
      body.driverId === ""
        ? null
        : typeof body.driverId === "string"
          ? body.driverId.trim()
          : "";

    const destination =
      typeof body.destination === "string"
        ? body.destination.trim()
        : "";

    const purpose =
      typeof body.purpose === "string"
        ? body.purpose.trim()
        : "";

    const passengerCount = body.passengerCount;

    if (
      !vehicleId ||
      driverId === "" ||
      !destination ||
      !purpose ||
      destination.length > 255 ||
      purpose.length > 1000 ||
      !Number.isInteger(passengerCount) ||
      passengerCount < 1
    ) {
      return NextResponse.json(
        { message: "Periksa kembali data pengajuan." },
        { status: 400 }
      );
    }

    // Waktu wajib menggunakan ISO 8601 dengan zona waktu
    const hasValidTimezone = (value: unknown) =>
      typeof value === "string" &&
      /(Z|[+-]\d{2}:\d{2})$/i.test(value);

    if (
      !hasValidTimezone(body.startAt) ||
      !hasValidTimezone(body.endAt)
    ) {
      return NextResponse.json(
        {
          message:
            "Format waktu harus menggunakan ISO 8601 dengan zona waktu.",
        },
        { status: 400 }
      );
    }

    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);

    if (
      Number.isNaN(startAt.getTime()) ||
      Number.isNaN(endAt.getTime()) ||
      startAt <= new Date() ||
      endAt <= startAt
    ) {
      return NextResponse.json(
        {
          message:
            "Jadwal tidak valid. Waktu mulai harus di masa depan dan waktu selesai harus setelah waktu mulai.",
        },
        { status: 400 }
      );
    }

    // Pemeriksaan dan penyimpanan dalam transaksi Serializable
    const result = await prisma.$transaction(
      async (tx) => {
        const employee = await tx.employee.findUnique({
          where: {
            userId: session.user.id,
          },
        });

        if (!employee) {
          return { error: "EMPLOYEE_NOT_FOUND" as const };
        }

        const vehicle = await tx.vehicle.findUnique({
          where: { id: vehicleId },
        });

        if (!vehicle) {
          return { error: "VEHICLE_NOT_FOUND" as const };
        }

        if (vehicle.status !== "AVAILABLE") {
          return { error: "VEHICLE_UNAVAILABLE" as const };
        }

        let driver = null;

        if (driverId) {
          driver = await tx.driver.findUnique({
            where: { id: driverId },
          });

          if (!driver) {
            return { error: "DRIVER_NOT_FOUND" as const };
          }

          if (driver.status !== "ACTIVE") {
            return { error: "DRIVER_UNAVAILABLE" as const };
          }
        }

        // Kapasitas dihitung termasuk driver jika menggunakan driver.
        const totalOccupants =
          passengerCount + (driverId ? 1 : 0);

        if (totalOccupants > vehicle.seatCapacity) {
          return { error: "CAPACITY_EXCEEDED" as const };
        }

        const timeRange = {
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        };

        // Periksa bentrok jadwal kendaraan
        const vehicleConflict =
          await tx.vehicleReservation.findFirst({
            where: {
              vehicleId,
              status: { in: [...activeStatuses] },
              ...timeRange,
            },
          });

        if (vehicleConflict) {
          return { error: "VEHICLE_BOOKED" as const };
        }

        // Periksa bentrok jadwal driver
        if (driverId) {
          const driverConflict =
            await tx.vehicleReservation.findFirst({
              where: {
                driverId,
                status: { in: [...activeStatuses] },
                ...timeRange,
              },
            });

          if (driverConflict) {
            return { error: "DRIVER_BOOKED" as const };
          }
        }

        // Cegah karyawan membuat dua reservasi dalam waktu bersamaan
        const employeeConflict =
          await tx.vehicleReservation.findFirst({
            where: {
              employeeId: employee.id,
              status: { in: [...activeStatuses] },
              ...timeRange,
            },
          });

        if (employeeConflict) {
          return { error: "EMPLOYEE_BOOKED" as const };
        }

        const reservation =
          await tx.vehicleReservation.create({
            data: {
              employeeId: employee.id,
              vehicleId,
              driverId,
              startAt,
              endAt,
              destination,
              purpose,
              passengerCount,
              status: "PENDING",
            },
            include: {
              employee: {
                select: {
                  employeeCode: true,
                  fullName: true,
                },
              },
              vehicle: true,
              driver: true,
            },
          });

        return { reservation };
      },
      {
        isolationLevel: "Serializable",
      }
    );

    if ("error" in result) {
      const errors: Record<
        string,
        { message: string; status: number }
      > = {
        EMPLOYEE_NOT_FOUND: {
          message: "Profil karyawan tidak ditemukan.",
          status: 404,
        },
        VEHICLE_NOT_FOUND: {
          message: "Kendaraan tidak ditemukan.",
          status: 404,
        },
        VEHICLE_UNAVAILABLE: {
          message: "Kendaraan tidak tersedia.",
          status: 409,
        },
        DRIVER_NOT_FOUND: {
          message: "Driver tidak ditemukan.",
          status: 404,
        },
        DRIVER_UNAVAILABLE: {
          message: "Driver sedang tidak aktif.",
          status: 409,
        },
        CAPACITY_EXCEEDED: {
          message: "Jumlah orang melebihi kapasitas kendaraan.",
          status: 400,
        },
        VEHICLE_BOOKED: {
          message: "Kendaraan sudah memiliki reservasi pada jadwal tersebut.",
          status: 409,
        },
        DRIVER_BOOKED: {
          message: "Driver sudah memiliki jadwal pada waktu tersebut.",
          status: 409,
        },
        EMPLOYEE_BOOKED: {
          message: "Anda sudah memiliki reservasi pada waktu tersebut.",
          status: 409,
        },
      };

      const response = errors[result.error as keyof typeof errors];

      return NextResponse.json(
        { message: response.message },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        message: "Pengajuan reservasi berhasil dikirim dan menunggu persetujuan GA.",
        data: result.reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reservations:", error);

    // Konflik transaksi akibat permintaan bersamaan
    if (isDatabaseError(error) && error.code === "P2034") {
      return NextResponse.json(
        {
          message:
            "Jadwal baru saja berubah. Silakan periksa ketersediaan dan coba kembali.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengajukan reservasi." },
      { status: 500 }
    );
  }
}

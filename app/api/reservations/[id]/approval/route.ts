
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

const activeStatuses = ["PENDING", "APPROVED"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Periksa autentikasi
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Hanya GA dan ADMIN yang boleh melakukan approval
    if (
      session.user.role !== "GA" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses untuk melakukan approval." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Validasi UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { message: "ID reservasi tidak valid." },
        { status: 400 }
      );
    }

    // 3. Validasi request
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Format data tidak valid." },
        { status: 400 }
      );
    }

    const allowedFields = ["decision", "reviewNote"];
    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some((key) => !allowedFields.includes(key))
    ) {
      return NextResponse.json(
        { message: "Data approval tidak valid." },
        { status: 400 }
      );
    }

    const decision = body.decision;

    if (
      decision !== "APPROVED" &&
      decision !== "REJECTED"
    ) {
      return NextResponse.json(
        { message: "Keputusan harus APPROVED atau REJECTED." },
        { status: 400 }
      );
    }

    let reviewNote: string | null = null;

    if (body.reviewNote !== undefined && body.reviewNote !== null) {
    if (typeof body.reviewNote !== "string") {
        return NextResponse.json(
        { message: "Catatan review harus berupa teks." },
        { status: 400 }
        );
    }

    const note = body.reviewNote.trim();

    if (note.length > 1000) {
        return NextResponse.json(
        { message: "Catatan review maksimal 1000 karakter." },
        { status: 400 }
        );
    }

    reviewNote = note || null;
    }

    // Penolakan wajib disertai alasan
    if (decision === "REJECTED" && !reviewNote) {
      return NextResponse.json(
        { message: "Alasan penolakan wajib diisi." },
        { status: 400 }
      );
    }

    // 4. Proses review dalam transaksi
    const result = await prisma.$transaction(
      async (tx) => {
        const reservation =
          await tx.vehicleReservation.findUnique({
            where: { id },
          });

        if (!reservation) {
          return { error: "NOT_FOUND" as const };
        }

        // Reservasi yang sudah direview tidak boleh diproses kembali
        if (reservation.status !== "PENDING") {
          return { error: "ALREADY_REVIEWED" as const };
        }

        // 5. Periksa ulang ketersediaan sebelum approval
        if (decision === "APPROVED") {
          const timeRange = {
            startAt: { lt: reservation.endAt },
            endAt: { gt: reservation.startAt },
          };

          const vehicleConflict =
            await tx.vehicleReservation.findFirst({
              where: {
                id: { not: id },
                vehicleId: reservation.vehicleId,
                status: { in: [...activeStatuses] },
                ...timeRange,
              },
            });

          if (vehicleConflict) {
            return { error: "VEHICLE_BOOKED" as const };
          }

          if (reservation.driverId) {
            const driverConflict =
              await tx.vehicleReservation.findFirst({
                where: {
                  id: { not: id },
                  driverId: reservation.driverId,
                  status: { in: [...activeStatuses] },
                  ...timeRange,
                },
              });

            if (driverConflict) {
              return { error: "DRIVER_BOOKED" as const };
            }
          }

          const employeeConflict =
            await tx.vehicleReservation.findFirst({
              where: {
                id: { not: id },
                employeeId: reservation.employeeId,
                status: { in: [...activeStatuses] },
                ...timeRange,
              },
            });

          if (employeeConflict) {
            return { error: "EMPLOYEE_BOOKED" as const };
          }
        }

        // 6. Update hanya jika status masih PENDING
        const updated =
          await tx.vehicleReservation.updateMany({
            where: {
              id,
              status: "PENDING",
            },
            data: {
              status: decision,
              approvedById: session.user.id,
              reviewedAt: new Date(),
              reviewNote,
            },
          });

        if (updated.count !== 1) {
          return { error: "ALREADY_REVIEWED" as const };
        }

        // 7. Ambil data terbaru
        const updatedReservation =
          await tx.vehicleReservation.findUnique({
            where: { id },
            include: {
              employee: {
                select: {
                  employeeCode: true,
                  fullName: true,
                  department: true,
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
          });

        return { reservation: updatedReservation };
      },
      {
        isolationLevel: "Serializable",
      }
    );

    // 8. Penanganan hasil transaksi
    if ("error" in result) {
      const errors: Record<
        string,
        { message: string; status: number }
      > = {
        NOT_FOUND: {
          message: "Data reservasi tidak ditemukan.",
          status: 404,
        },
        ALREADY_REVIEWED: {
          message: "Reservasi sudah diproses sebelumnya.",
          status: 409,
        },
        VEHICLE_BOOKED: {
          message: "Kendaraan memiliki jadwal reservasi yang bertabrakan.",
          status: 409,
        },
        DRIVER_BOOKED: {
          message: "Driver memiliki jadwal yang bertabrakan.",
          status: 409,
        },
        EMPLOYEE_BOOKED: {
          message: "Karyawan memiliki reservasi lain pada waktu tersebut.",
          status: 409,
        },
      };

        const response =
        errors[result.error as keyof typeof errors] ?? {
            message: "Gagal memproses persetujuan reservasi.",
            status: 400,
        };

      return NextResponse.json(
        { message: response.message },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message:
        decision === "APPROVED"
          ? "Reservasi berhasil disetujui."
          : "Reservasi berhasil ditolak.",
      data: result.reservation,
    });
  } catch (error) {
    console.error("PATCH /api/reservations/[id]/approval:", error);

    if (isDatabaseError(error) && error.code === "P2034") {
      return NextResponse.json(
        {
          message:
            "Terjadi konflik transaksi. Silakan muat ulang data dan coba kembali.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses approval." },
      { status: 500 }
    );
  }
}

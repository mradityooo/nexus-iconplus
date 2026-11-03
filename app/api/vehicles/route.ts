
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const canManageVehicles = (role: string) =>
  role === "GA" || role === "ADMIN";

// GET: Menampilkan semua kendaraan
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Data kendaraan berhasil diambil.",
      data: vehicles,
    });
  } catch (error) {
    console.error("GET /api/vehicles:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data kendaraan." },
      { status: 500 }
    );
  }
}

// POST: Menambahkan kendaraan
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    if (!canManageVehicles(session.user.role)) {
      return NextResponse.json(
        { message: "Anda tidak memiliki akses." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Format data tidak valid." },
        { status: 400 }
      );
    }

    const vehicleCode =
      typeof body.vehicleCode === "string"
        ? body.vehicleCode.trim().toUpperCase()
        : "";

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const plateNumber =
      typeof body.plateNumber === "string"
        ? body.plateNumber.trim().toUpperCase()
        : "";

    const vehicleType =
      typeof body.vehicleType === "string"
        ? body.vehicleType.trim()
        : null;

    const seatCapacity = Number(body.seatCapacity);

    const validStatuses = [
      "AVAILABLE",
      "MAINTENANCE",
      "INACTIVE",
    ];

    const status = body.status ?? "AVAILABLE";

    if (
      !vehicleCode ||
      !name ||
      !plateNumber ||
      !Number.isInteger(seatCapacity) ||
      seatCapacity < 1 ||
      !validStatuses.includes(status)
    ) {
      return NextResponse.json(
        { message: "Periksa kembali data kendaraan." },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleCode,
        name,
        plateNumber,
        vehicleType,
        seatCapacity,
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Kendaraan berhasil ditambahkan.",
        data: vehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/vehicles:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "Kode kendaraan atau nomor plat sudah digunakan.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan kendaraan." },
      { status: 500 }
    );
  }
}

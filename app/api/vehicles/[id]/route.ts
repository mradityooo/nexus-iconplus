
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const canManageVehicles = (role: string) =>
  role === "GA" || role === "ADMIN";

// GET: Detail kendaraan berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      return NextResponse.json(
        { message: "Kendaraan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: vehicle });
  } catch (error) {
    console.error("GET /api/vehicles/[id]:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail kendaraan." },
      { status: 500 }
    );
  }
}

// PATCH: Mengubah data kendaraan
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Format data tidak valid." },
        { status: 400 }
      );
    }

    const allowedFields = [
      "vehicleCode",
      "name",
      "plateNumber",
      "vehicleType",
      "seatCapacity",
      "status",
    ];

    const keys = Object.keys(body);

    if (
      keys.length === 0 ||
      keys.some((key) => !allowedFields.includes(key))
    ) {
      return NextResponse.json(
        { message: "Data perubahan tidak valid." },
        { status: 400 }
      );
    }

    const data: {
      vehicleCode?: string;
      name?: string;
      plateNumber?: string;
      vehicleType?: string | null;
      seatCapacity?: number;
      status?: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
    } = {};

    if ("vehicleCode" in body) {
      if (typeof body.vehicleCode !== "string" || !body.vehicleCode.trim()) {
        return NextResponse.json(
          { message: "Kode kendaraan tidak valid." },
          { status: 400 }
        );
      }

      data.vehicleCode = body.vehicleCode.trim().toUpperCase();
    }

    if ("name" in body) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json(
          { message: "Nama kendaraan tidak valid." },
          { status: 400 }
        );
      }

      data.name = body.name.trim();
    }

    if ("plateNumber" in body) {
      if (typeof body.plateNumber !== "string" || !body.plateNumber.trim()) {
        return NextResponse.json(
          { message: "Nomor plat tidak valid." },
          { status: 400 }
        );
      }

      data.plateNumber = body.plateNumber.trim().toUpperCase();
    }

    if ("vehicleType" in body) {
      if (
        body.vehicleType !== null &&
        typeof body.vehicleType !== "string"
      ) {
        return NextResponse.json(
          { message: "Tipe kendaraan tidak valid." },
          { status: 400 }
        );
      }

      data.vehicleType =
        typeof body.vehicleType === "string"
          ? body.vehicleType.trim() || null
          : null;
    }

    if ("seatCapacity" in body) {
      const capacity = Number(body.seatCapacity);

      if (!Number.isInteger(capacity) || capacity < 1) {
        return NextResponse.json(
          { message: "Kapasitas kendaraan tidak valid." },
          { status: 400 }
        );
      }

      data.seatCapacity = capacity;
    }

    if ("status" in body) {
      const statuses = [
        "AVAILABLE",
        "MAINTENANCE",
        "INACTIVE",
      ] as const;

      if (
        typeof body.status !== "string" ||
        !statuses.includes(body.status as (typeof statuses)[number])
      ) {
        return NextResponse.json(
          { message: "Status kendaraan tidak valid." },
          { status: 400 }
        );
      }

      data.status = body.status as (typeof statuses)[number];
    }

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Data kendaraan berhasil diperbarui.",
      data: vehicle,
    });
  } catch (error) {
    console.error("PATCH /api/vehicles/[id]:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error
    ) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "Kode kendaraan atau nomor plat sudah digunakan." },
          { status: 409 }
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Kendaraan tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal memperbarui kendaraan." },
      { status: 500 }
    );
  }
}

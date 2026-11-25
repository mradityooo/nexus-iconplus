
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const canManageDrivers = (role: string) =>
  role === "GA" || role === "ADMIN";

// GET: Menampilkan daftar driver
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const drivers = await prisma.driver.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      message: "Data driver berhasil diambil.",
      data: drivers,
    });
  } catch (error) {
    console.error("GET /api/drivers:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data driver." },
      { status: 500 }
    );
  }
}

// POST: Menambahkan driver
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    if (!canManageDrivers(session.user.role)) {
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

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";

    const phone =
      typeof body.phone === "string" ? body.phone.trim() : null;

    const licenseNumber =
      typeof body.licenseNumber === "string"
        ? body.licenseNumber.trim().toUpperCase() || null
        : null;

    const status = body.status ?? "ACTIVE";
    const validStatuses = ["ACTIVE", "INACTIVE"];

    if (!fullName || !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Periksa kembali data driver." },
        { status: 400 }
      );
    }

    if (
      body.phone !== undefined &&
      body.phone !== null &&
      typeof body.phone !== "string"
    ) {
      return NextResponse.json(
        { message: "Nomor telepon tidak valid." },
        { status: 400 }
      );
    }

    if (
      body.licenseNumber !== undefined &&
      body.licenseNumber !== null &&
      typeof body.licenseNumber !== "string"
    ) {
      return NextResponse.json(
        { message: "Nomor SIM tidak valid." },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.create({
      data: {
        fullName,
        phone,
        licenseNumber,
        status: status as "ACTIVE" | "INACTIVE",
      },
    });

    return NextResponse.json(
      {
        message: "Driver berhasil ditambahkan.",
        data: driver,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/drivers:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Nomor SIM sudah terdaftar." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Gagal menambahkan driver." },
      { status: 500 }
    );
  }
}

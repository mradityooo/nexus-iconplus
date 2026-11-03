
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const canManageDrivers = (role: string) =>
  role === "GA" || role === "ADMIN";

// GET: Detail driver
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

    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      return NextResponse.json(
        { message: "Driver tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: driver });
  } catch (error) {
    console.error("GET /api/drivers/[id]:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail driver." },
      { status: 500 }
    );
  }
}

// PATCH: Mengubah data driver
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

    if (!canManageDrivers(session.user.role)) {
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
      "fullName",
      "phone",
      "licenseNumber",
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
      fullName?: string;
      phone?: string | null;
      licenseNumber?: string | null;
      status?: "ACTIVE" | "INACTIVE";
    } = {};

    if ("fullName" in body) {
      if (
        typeof body.fullName !== "string" ||
        !body.fullName.trim()
      ) {
        return NextResponse.json(
          { message: "Nama driver tidak valid." },
          { status: 400 }
        );
      }

      data.fullName = body.fullName.trim();
    }

    if ("phone" in body) {
      if (
        body.phone !== null &&
        typeof body.phone !== "string"
      ) {
        return NextResponse.json(
          { message: "Nomor telepon tidak valid." },
          { status: 400 }
        );
      }

      data.phone =
        typeof body.phone === "string"
          ? body.phone.trim() || null
          : null;
    }

    if ("licenseNumber" in body) {
      if (
        body.licenseNumber !== null &&
        typeof body.licenseNumber !== "string"
      ) {
        return NextResponse.json(
          { message: "Nomor SIM tidak valid." },
          { status: 400 }
        );
      }

      data.licenseNumber =
        typeof body.licenseNumber === "string"
          ? body.licenseNumber.trim().toUpperCase() || null
          : null;
    }

    if ("status" in body) {
      if (
        body.status !== "ACTIVE" &&
        body.status !== "INACTIVE"
      ) {
        return NextResponse.json(
          { message: "Status driver tidak valid." },
          { status: 400 }
        );
      }

      data.status = body.status;
    }

    const driver = await prisma.driver.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Data driver berhasil diperbarui.",
      data: driver,
    });
  } catch (error) {
    console.error("PATCH /api/drivers/[id]:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error
    ) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "Nomor SIM sudah terdaftar." },
          { status: 409 }
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Driver tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal memperbarui data driver." },
      { status: 500 }
    );
  }
}

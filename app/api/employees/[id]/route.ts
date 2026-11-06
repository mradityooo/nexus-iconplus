
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();

  if (
    !session?.user ||
    !["GA", "ADMIN"].includes(session.user.role)
  ) {
    return null;
  }

  return session;
}

// GET DETAIL KARYAWAN
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            status: true,
            role: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: employee });
  } catch (error) {
    console.error("[GET EMPLOYEE]", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail karyawan." },
      { status: 500 }
    );
  }
}

// UPDATE KARYAWAN
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const employeeCode = String(body.employeeCode ?? "")
      .trim()
      .toUpperCase();

    const fullName = String(body.fullName ?? "").trim();

    if (!employeeCode || !fullName) {
      return NextResponse.json(
        { message: "Employee ID dan nama wajib diisi." },
        { status: 400 }
      );
    }

    const existing = await prisma.employee.findUnique({
      where: { employeeCode },
    });

    if (existing && existing.id !== id) {
      return NextResponse.json(
        { message: "Employee ID sudah digunakan." },
        { status: 409 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        employeeCode,
        fullName,
        phone: body.phone?.trim() || null,
        department: body.department?.trim() || null,
        position: body.position?.trim() || null,
        workLocation: body.workLocation?.trim() || null,
        joinDate: body.joinDate
          ? new Date(body.joinDate)
          : null,
      },
    });

    return NextResponse.json({
      message: "Data karyawan berhasil diperbarui.",
      data: employee,
    });
  } catch (error) {
    console.error("[UPDATE EMPLOYEE]", error);

    return NextResponse.json(
      { message: "Gagal memperbarui data karyawan." },
      { status: 500 }
    );
  }
}


// DELETE KARYAWAN
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            reservations: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (employee.userId || employee._count.reservations > 0) {
      return NextResponse.json(
        {
          message:
            "Karyawan tidak dapat dihapus karena sudah memiliki akun atau riwayat reservasi.",
        },
        { status: 409 }
      );
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Karyawan berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE EMPLOYEE]", error);

    return NextResponse.json(
      { message: "Gagal menghapus karyawan." },
      { status: 500 }
    );
  }
}

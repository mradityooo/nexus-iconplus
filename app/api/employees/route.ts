
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

// GET: Mengambil seluruh data karyawan
export async function GET() {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
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

    return NextResponse.json({
      data: employees,
    });
  } catch (error) {
    console.error("[GET EMPLOYEES]", error);

    return NextResponse.json(
      { message: "Gagal mengambil data karyawan." },
      { status: 500 }
    );
  }
}

// POST: Menambahkan karyawan baru
export async function POST(request: NextRequest) {
  try {
    const session = await checkAdmin();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const employeeCode = String(body.employeeCode ?? "")
      .trim()
      .toUpperCase();

    const fullName = String(body.fullName ?? "").trim();

    const phone = String(body.phone ?? "").trim();
    const department = String(body.department ?? "").trim();
    const position = String(body.position ?? "").trim();
    const workLocation = String(body.workLocation ?? "").trim();

    const joinDate = body.joinDate
    ? new Date(body.joinDate)
    : null;

    if (joinDate && Number.isNaN(joinDate.getTime())) {
    return NextResponse.json(
        { message: "Format tanggal bergabung tidak valid." },
        { status: 400 }
    );
    }

    if (!employeeCode || !fullName) {
      return NextResponse.json(
        { message: "Employee ID dan nama wajib diisi." },
        { status: 400 }
      );
    }

    const existing = await prisma.employee.findUnique({
      where: { employeeCode },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Employee ID sudah terdaftar." },
        { status: 409 }
      );
    }

    const employee = await prisma.employee.create({
    data: {
        employeeCode,
        fullName,
        phone: phone || null,
        department: department || null,
        position: position || null,
        workLocation: workLocation || null,
        joinDate,
        userId: null,
    },
    });

    return NextResponse.json(
      {
        message: "Karyawan berhasil ditambahkan.",
        data: employee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE EMPLOYEE]", error);

    return NextResponse.json(
      { message: "Gagal menambahkan karyawan." },
      { status: 500 }
    );
  }
}

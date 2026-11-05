
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const employeeCode = String(body.employeeCode ?? "")
      .trim()
      .toUpperCase();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const password = String(body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!employeeCode || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Konfirmasi password tidak cocok." },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeCode },
    });

    if (!employee || employee.userId !== null) {
      return NextResponse.json(
        { message: "Employee ID tidak valid atau sudah digunakan." },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "EMPLOYEE",
          status: "ACTIVE",
        },
      });

      const linkedEmployee = await tx.employee.updateMany({
        where: {
          id: employee.id,
          userId: null,
        },
        data: {
          userId: user.id,
        },
      });

      if (linkedEmployee.count !== 1) {
        throw new Error("EMPLOYEE_ALREADY_LINKED");
      }
    });

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan login." },
      { status: 201 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMPLOYEE_ALREADY_LINKED"
    ) {
      return NextResponse.json(
        { message: "Employee ID sudah digunakan." },
        { status: 409 }
      );
    }

    console.error("[REGISTER ERROR]", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi." },
      { status: 500 }
    );
  }
}

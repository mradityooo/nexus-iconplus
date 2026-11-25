
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fullName: employee.fullName,
      position: employee.position,
      employeeCode: employee.employeeCode,
      email: employee.user?.email ?? null,
      department: employee.department,
    });
  } catch (error) {
    console.error("GET CLAIM PROFILE ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil informasi karyawan" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH: Menyimpan Additional Notes pada seluruh klaim PENDING karyawan
export async function PATCH(req: Request) {
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
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const notes =
      typeof body.notes === "string" ? body.notes.trim() : "";

    const result = await prisma.claim.updateMany({
      where: {
        employeeId: employee.id,
        status: "PENDING",
      },
      data: {
        notes: notes || null,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Tidak ada klaim PENDING untuk diperbarui" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Additional Notes berhasil disimpan",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("UPDATE CLAIM NOTES ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menyimpan Additional Notes" },
      { status: 500 }
    );
  }
}

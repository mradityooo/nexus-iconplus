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
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Selalu batasi data berdasarkan employee dari session,
    // bukan employeeId yang dikirim browser.
    const requests = await prisma.claimRequest.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        requestNumber: true,
        totalAmount: true,
        status: true,
        notes: true,
        reviewNote: true,
        createdAt: true,

        employee: {
          select: {
            fullName: true,
            position: true,
            employeeCode: true,
            department: true,
            workLocation: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },

        claims: {
          orderBy: { transactionDate: "asc" },
          select: {
            id: true,
            category: true,
            transactionDate: true,
            description: true,
            amount: true,
            status: true,
            reference: true,
          },
        },

        reviews: {
          orderBy: { createdAt: "asc" },
          select: {
            stage: true,
            decision: true,
            note: true,
            createdAt: true,
            reviewer: {
              select: {
                email: true,
                employee: {
                  select: {
                    fullName: true,
                    position: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error("GET CLAIM REQUESTS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil riwayat pengajuan klaim" },
      { status: 500 }
    );
  }
}

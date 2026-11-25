
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const businessTravel = await prisma.businessTravelRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            employeeCode: true,
            fullName: true,
            department: true,
            position: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            email: true,
          },
        },
        facilities: true,
      },
    });

    if (!businessTravel) {
      return NextResponse.json(
        { success: false, message: "Pengajuan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: businessTravel,
    });
  } catch (error) {
    console.error("GET BUSINESS TRAVEL DETAIL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail pengajuan." },
      { status: 500 }
    );
  }
}

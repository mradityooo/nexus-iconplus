
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.businessTravelRequest.count();

console.log("ADMIN BUSINESS TRAVEL COUNT:", count);
    const businessTravels =
      await prisma.businessTravelRequest.findMany({
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
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      success: true,
      data: businessTravels,
    });
  } catch (error) {
    console.error("GET ADMIN BUSINESS TRAVEL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data perjalanan dinas.",
      },
      { status: 500 }
    );
  }
}

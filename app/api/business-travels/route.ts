import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedFacilities = [
  "FLIGHT_TICKET",
  "HOTEL",
  "OTHER_TRANSPORTATION",
] as const;

// GET: Mengambil daftar pengajuan perjalanan dinas
export async function GET() {
  try {
    const count = await prisma.businessTravelRequest.count();

console.log("USER BUSINESS TRAVEL COUNT:", count);
    const businessTravels = await prisma.businessTravelRequest.findMany({
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
    console.error("GET BUSINESS TRAVEL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data perjalanan dinas.",
      },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    // 1. Ambil session user yang sedang login
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // 2. Cari employee berdasarkan userId dari session
    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Data karyawan tidak ditemukan pada akun ini.",
        },
        { status: 404 }
      );
    }

    // 3. Ambil data pengajuan dari frontend
    const body = await request.json();

    const {
      destination,
      purpose,
      departureDate,
      returnDate,
      transportation,
      notes,
      facilities = [],
    } = body;

    // 4. Validasi data wajib
    if (
      typeof destination !== "string" ||
      !destination.trim() ||
      typeof purpose !== "string" ||
      !purpose.trim() ||
      !departureDate ||
      !returnDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pengajuan belum lengkap.",
        },
        { status: 400 }
      );
    }

    // 5. Validasi tanggal
    const departure = new Date(departureDate);
    const returning = new Date(returnDate);

    if (
      Number.isNaN(departure.getTime()) ||
      Number.isNaN(returning.getTime()) ||
      returning < departure
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Tanggal perjalanan tidak valid.",
        },
        { status: 400 }
      );
    }

    // 6. Validasi fasilitas
    if (
      !Array.isArray(facilities) ||
      facilities.some(
        (facility) =>
          !allowedFacilities.includes(facility)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Jenis fasilitas tidak valid.",
        },
        { status: 400 }
      );
    }

    // 7. Simpan pengajuan ke PostgreSQL
    const businessTravel =
      await prisma.businessTravelRequest.create({
        data: {
          employeeId: employee.id,
          destination: destination.trim(),
          purpose: purpose.trim(),
          departureDate: departure,
          returnDate: returning,
          transportation: transportation || null,
          notes: notes || null,
          facilities: {
            create: [...new Set(facilities)].map((type) => ({
              type,
            })),
          },
        },
        include: {
          employee: true,
          facilities: true,
        },
      });

    // 8. Kirim respons berhasil
    return NextResponse.json(
      {
        success: true,
        message: "Pengajuan perjalanan dinas berhasil dibuat.",
        data: businessTravel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST BUSINESS TRAVEL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat pengajuan perjalanan dinas.",
      },
      { status: 500 }
    );
  }
}


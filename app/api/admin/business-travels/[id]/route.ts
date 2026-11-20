import { auth } from "@/auth";
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


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Periksa sesi Admin
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Hanya role yang berwenang yang dapat memproses pengajuan
    const allowedRoles = ["ADMIN", "GA", "SUPERVISOR"];

    if (!allowedRoles.includes(session.user.role ?? "")) {
      return NextResponse.json(
        { success: false, message: "Anda tidak memiliki akses." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { status, reviewNote } = body;

    // 2. Validasi keputusan
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status keputusan tidak valid." },
        { status: 400 }
      );
    }

    if (
      status === "REJECTED" &&
      (typeof reviewNote !== "string" || !reviewNote.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Alasan penolakan wajib diisi.",
        },
        { status: 400 }
      );
    }

    // 3. Pastikan pengajuan masih menunggu persetujuan
    const updated = await prisma.businessTravelRequest.updateMany({
      where: {
        id,
        status: "PENDING",
      },
      data: {
        status,
        reviewNote: reviewNote?.trim() || null,
        reviewedAt: new Date(),
        approvedById: session.user.id,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pengajuan tidak ditemukan atau sudah diproses sebelumnya.",
        },
        { status: 409 }
      );
    }

    // 4. Ambil data terbaru
    const businessTravel =
      await prisma.businessTravelRequest.findUnique({
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

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Pengajuan berhasil disetujui."
          : "Pengajuan berhasil ditolak.",
      data: businessTravel,
    });
  } catch (error) {
    console.error("UPDATE BUSINESS TRAVEL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses pengajuan perjalanan dinas.",
      },
      { status: 500 }
    );
  }
}


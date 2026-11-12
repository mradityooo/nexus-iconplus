
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

    const reservations = await prisma.vehicleReservation.findMany({
      where: {
        status: "APPROVED",
        employee: {
          userId: session.user.id,
        },
        inspection: null,
      },
      include: {
        vehicle: true,
        driver: true,
        employee: true,
      },
      orderBy: {
        startAt: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("GET inspections error:", error);

    return NextResponse.json(
      { message: "Gagal mengambil reservasi untuk inspeksi" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { reservationId, notes, items } = body;

    if (
      typeof reservationId !== "string" ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { message: "Data inspeksi tidak lengkap" },
        { status: 400 }
      );
    }

    const validConditions = [
      "GOOD",
      "NEEDS_ATTENTION",
      "NOT_APPLICABLE",
    ];

    const templateIds = items.map((item) => item.templateId);

    if (
      items.some(
        (item) =>
          typeof item.templateId !== "string" ||
          !validConditions.includes(item.condition)
      ) ||
      new Set(templateIds).size !== items.length
    ) {
      return NextResponse.json(
        { message: "Data checklist tidak valid" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.vehicleReservation.findFirst({
        where: {
          id: reservationId,
          status: "APPROVED",
          employee: {
            userId: session.user.id,
          },
        },
        include: {
          employee: true,
          vehicle: true,
        },
      });

      if (!reservation) {
        throw new Error("RESERVATION_NOT_FOUND");
      }

      const templates = await tx.inspectionTemplate.findMany({
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      const activeTemplateIds = templates.map((template) => template.id);

      if (
        activeTemplateIds.length !== items.length ||
        !activeTemplateIds.every((id) => templateIds.includes(id))
      ) {
        throw new Error("CHECKLIST_INCOMPLETE");
      }

      const inspection = await tx.inspection.create({
        data: {
          reservationId: reservation.id,
          employeeId: reservation.employeeId,
          vehicleId: reservation.vehicleId,
          status: "SUBMITTED",
          notes:
            typeof notes === "string" && notes.trim()
              ? notes.trim()
              : null,
          inspectedAt: new Date(),
          items: {
            create: items.map((item) => ({
              templateId: item.templateId,
              condition: item.condition,
            })),
          },
        },
        include: {
          items: {
            include: {
              template: true,
            },
          },
          vehicle: true,
        },
      });

      return inspection;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pre-Use Inspection berhasil dikirim",
        data: result,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("POST inspection error:", error);

    if (error instanceof Error) {
      if (error.message === "RESERVATION_NOT_FOUND") {
        return NextResponse.json(
          { message: "Reservasi tidak ditemukan atau belum disetujui" },
          { status: 404 }
        );
      }

      if (error.message === "CHECKLIST_INCOMPLETE") {
        return NextResponse.json(
          { message: "Semua checklist aktif wajib diisi" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal menyimpan hasil inspeksi" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    // 1. Authentication
    const session = await auth();

    if (!session?.user || !["GA", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ambil ID klaim
    const { id } = await params;

    // 3. Ambil data request
    const body = await request.json();
    const { action, reviewNote } = body;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid review action" },
        { status: 400 }
      );
    }

    // 4. Validasi catatan penolakan
    if (
      action === "REJECT" &&
      (!reviewNote || !reviewNote.trim())
    ) {
      return NextResponse.json(
        { message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // 5. Tentukan status baru
    const newStatus =
      action === "APPROVE" ? "APPROVED" : "REJECTED";

    // 6. Update hanya jika klaim masih PENDING
    const result = await prisma.claim.updateMany({
      where: {
        id,
        status: "PENDING",
      },
      data: {
        status: newStatus,
        approvedById: session.user.id,
        reviewedAt: new Date(),
        reviewNote:
          action === "REJECT" ? reviewNote.trim() : null,
      },
    });

    if (result.count === 0) {
      const existingClaim = await prisma.claim.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingClaim) {
        return NextResponse.json(
          { message: "Claim not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "This claim has already been reviewed" },
        { status: 409 }
      );
    }

    // 7. Ambil data terbaru
    const updatedClaim = await prisma.claim.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        reviewNote: true,
        approvedById: true,
        reviewedAt: true,
      },
    });

    return NextResponse.json({
      message:
        action === "APPROVE"
          ? "Claim approved successfully"
          : "Claim rejected successfully",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Claim review error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

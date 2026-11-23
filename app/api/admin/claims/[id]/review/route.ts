import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type ReviewAction = "APPROVE" | "REJECT";

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Pastikan pengguna sudah login.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

  // ADMIN lama sementara diperlakukan sebagai GA,
  // karena akun GA yang tersedia saat ini masih memakai role ADMIN.
  const reviewerRole = session.user.role;

  const stageConfig = {
    GA: {
      stage: "GA",
      currentStatus: "PENDING_GA",
      nextStatus: "PENDING_BRANCH_HEAD",
    },
    ADMIN: {
      stage: "GA",
      currentStatus: "PENDING_GA",
      nextStatus: "PENDING_BRANCH_HEAD",
    },
    BRANCH_HEAD: {
      stage: "BRANCH_HEAD",
      currentStatus: "PENDING_BRANCH_HEAD",
      nextStatus: "PENDING_TREASURER",
    },
    TREASURER: {
      stage: "TREASURER",
      currentStatus: "PENDING_TREASURER",
      nextStatus: "PROCESSING_PAYMENT",
    },
  } as const;

  if (!(reviewerRole in stageConfig)) {
    return NextResponse.json(
      { message: "Anda tidak memiliki izin untuk mereview klaim" },
      { status: 403 }
    );
  }

const reviewerConfig =
  stageConfig[reviewerRole as keyof typeof stageConfig];


    const { id: requestId } = await params;

    // Tolak ID yang bukan UUID sebelum dipakai sebagai ID Prisma.
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(requestId)) {
      return NextResponse.json(
        { message: "ID pengajuan tidak valid" },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Body request harus berupa JSON yang valid" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { message: "Data review tidak valid" },
        { status: 400 }
      );
    }

    const payload = body as {
      action?: unknown;
      reviewNote?: unknown;
    };

    const action = payload.action;
    const reviewNote =
      typeof payload.reviewNote === "string"
        ? payload.reviewNote.trim()
        : "";

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        { message: "Aksi review harus APPROVE atau REJECT" },
        { status: 400 }
      );
    }

    if (action === "REJECT" && !reviewNote) {
      return NextResponse.json(
        { message: "Alasan penolakan wajib diisi" },
        { status: 400 }
      );
    }

    const requestStatus =
      action === "REJECT" ? "REJECTED" : reviewerConfig.nextStatus;

    const reviewedAt = new Date();

    const result = await prisma.$transaction(async (tx) => {
      const claimRequest = await tx.claimRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          status: true,
          claims: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!claimRequest) {
        throw new Error("CLAIM_REQUEST_NOT_FOUND");
      }

      if (claimRequest.status !== reviewerConfig.currentStatus) {
        throw new Error("CLAIM_REQUEST_WRONG_STAGE");
      }

      if (claimRequest.claims.length === 0) {
        throw new Error("CLAIM_REQUEST_HAS_NO_ITEMS");
      }

      // Hindari menyetujui request bila status item-itemnya sudah tidak konsisten.
      if (claimRequest.claims.some((claim) => claim.status !== "PENDING")) {
        throw new Error("CLAIM_ITEM_STATUS_MISMATCH");
      }

      // Update bersyarat agar dua reviewer yang submit bersamaan tidak
      // sama-sama berhasil mereview request yang sama.
      const updatedRequest = await tx.claimRequest.updateMany({
        where: {
          id: requestId,
          status: reviewerConfig.currentStatus,
        },
        data: {
          status: requestStatus,
          approvedById: session.user.id,
          reviewedAt,
          reviewNote: action === "REJECT" ? reviewNote : null,
        },
      });

      if (updatedRequest.count !== 1) {
        throw new Error("CLAIM_REQUEST_ALREADY_REVIEWED");
      }

      // Klaim tetap PENDING selama GA dan Kepala Cabang memeriksa.
      // Jika ditolak, tandai semua item REJECTED.
      // Setelah disetujui Bendahara, item masuk PROCESSING_PAYMENT.
      const itemStatus =
        action === "REJECT"
          ? "REJECTED"
          : reviewerConfig.stage === "TREASURER"
            ? "PROCESSING"
            : null;

      let updatedClaimCount = 0;

      if (itemStatus) {
        const updatedClaims = await tx.claim.updateMany({
          where: {
            requestId,
            status: "PENDING",
          },
          data: {
            status: itemStatus,
            ...(action === "REJECT"
              ? {
                  approvedById: session.user.id,
                  reviewedAt,
                  reviewNote,
                }
              : {}),
          },
        });

        if (updatedClaims.count !== claimRequest.claims.length) {
          throw new Error("CLAIM_ITEM_UPDATE_COUNT_MISMATCH");
        }

        updatedClaimCount = updatedClaims.count;
      }

      await tx.claimRequestReview.create({
        data: {
          requestId,
          reviewerId: session.user.id,
          stage: reviewerConfig.stage,
          decision: action === "APPROVE" ? "APPROVED" : "REJECTED",
          note: reviewNote || null,
        },
      });

      return {
        id: requestId,
        status: requestStatus,
        reviewedAt,
        updatedClaimCount,
      };
    });

    return NextResponse.json({
      message:
        action === "APPROVE"
          ? "Seluruh item dalam pengajuan berhasil disetujui"
          : "Seluruh item dalam pengajuan berhasil ditolak",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "CLAIM_REQUEST_NOT_FOUND":
          return NextResponse.json(
            { message: "Pengajuan klaim tidak ditemukan" },
            { status: 404 }
          );

        case "CLAIM_REQUEST_ALREADY_REVIEWED":
          return NextResponse.json(
            { message: "Pengajuan ini sudah direview atau tidak berstatus PENDING" },
            { status: 409 }
          );

        case "CLAIM_REQUEST_HAS_NO_ITEMS":
          return NextResponse.json(
            { message: "Pengajuan tidak memiliki item klaim" },
            { status: 409 }
          );

        case "CLAIM_ITEM_STATUS_MISMATCH":
        case "CLAIM_ITEM_UPDATE_COUNT_MISMATCH":
          console.error("CLAIM REQUEST REVIEW CONSISTENCY ERROR:", error);
          return NextResponse.json(
            { message: "Status item klaim tidak konsisten. Tidak ada perubahan yang disimpan." },
            { status: 409 }
          );

        case "CLAIM_REQUEST_WRONG_STAGE":
        return NextResponse.json(
          { message: "Pengajuan belum berada pada tahap yang dapat Anda proses" },
          { status: 409 }
        );
      }
    }

    console.error("CLAIM REQUEST REVIEW ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mereview pengajuan klaim" },
      { status: 500 }
    );
  }
}

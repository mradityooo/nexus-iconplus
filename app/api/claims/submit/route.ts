
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    // 1. Validasi session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Cari data karyawan
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

    // 3. Ambil catatan pengajuan (opsional)
    let notes: string | null = null;

    try {
      const body = await req.json();
      notes =
        typeof body.notes === "string"
          ? body.notes.trim() || null
          : null;
    } catch {
      // Body boleh kosong
    }

    // 4. Proses pengajuan dalam satu transaksi
    const result = await prisma.$transaction(async (tx) => {
      // Ambil semua item DRAFT yang belum disubmit
      const draftClaims = await tx.claim.findMany({
        where: {
          employeeId: employee.id,
          status: "DRAFT",
          requestId: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (draftClaims.length === 0) {
        throw new Error("NO_DRAFT_CLAIMS");
      }

      // Hitung total nominal seluruh item
      const totalAmount = draftClaims.reduce(
        (total, claim) => total + Number(claim.amount),
        0
      );

      if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
        throw new Error("INVALID_TOTAL_AMOUNT");
      }

      // Buat nomor pengajuan unik
      const requestNumber = `CLM-${Date.now()}-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

      // Buat satu ClaimRequest
      const claimRequest = await tx.claimRequest.create({
        data: {
          employeeId: employee.id,
          requestNumber,
          totalAmount,
          status: "PENDING_GA",
          notes,
        },
      });

      // Hubungkan seluruh item DRAFT ke request
      const updatedClaims = await tx.claim.updateMany({
        where: {
          employeeId: employee.id,
          status: "DRAFT",
          requestId: null,
        },
        data: {
          requestId: claimRequest.id,
          status: "PENDING",
        },
      });

      // Pastikan seluruh item berhasil dihubungkan
      if (updatedClaims.count !== draftClaims.length) {
        throw new Error("CLAIM_UPDATE_COUNT_MISMATCH");
      }

      return {
        ...claimRequest,
        claims: draftClaims.map((claim) => ({
          id: claim.id,
          category: claim.category,
          description: claim.description,
          amount: claim.amount,
          transactionDate: claim.transactionDate,
          receiptUrl: claim.receiptUrl,
        })),
      };
    });

    return NextResponse.json(
      {
        message: "Pengajuan klaim berhasil dikirim",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SUBMIT CLAIM ERROR:", error);

    if (error instanceof Error) {
      if (error.message === "NO_DRAFT_CLAIMS") {
        return NextResponse.json(
          { message: "Tidak ada item klaim yang dapat disubmit" },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_TOTAL_AMOUNT") {
        return NextResponse.json(
          { message: "Total pengajuan tidak valid" },
          { status: 400 }
        );
      }

      if (error.message === "CLAIM_UPDATE_COUNT_MISMATCH") {
        return NextResponse.json(
          { message: "Item klaim berubah saat proses submit. Silakan coba kembali." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Gagal mengirim pengajuan klaim" },
      { status: 500 }
    );
  }
}

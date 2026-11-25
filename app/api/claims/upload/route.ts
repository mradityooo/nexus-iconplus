
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME = "claim-receipts";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export async function POST(request: NextRequest) {
  try {
    // 1. Validasi login
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Cari data karyawan
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3. Ambil file dan claimId
    const formData = await request.formData();

    const file = formData.get("file");
    const claimId = formData.get("claimId");

    if (!(file instanceof File) || typeof claimId !== "string") {
      return NextResponse.json(
        { message: "File dan claimId wajib diisi" },
        { status: 400 }
      );
    }

    // 4. Validasi ukuran file
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran file harus lebih dari 0 dan maksimal 5 MB" },
        { status: 400 }
      );
    }

    // 5. Validasi format file
    const extension = ALLOWED_TYPES[file.type];

    if (!extension) {
      return NextResponse.json(
        { message: "Format file harus JPG, PNG, WebP, atau PDF" },
        { status: 400 }
      );
    }

    // 6. Pastikan klaim milik karyawan dan masih pending
    const claim = await prisma.claim.findFirst({
      where: {
        id: claimId,
        employeeId: employee.id,
        status: "PENDING",
      },
    });

    if (!claim) {
      return NextResponse.json(
        { message: "Klaim tidak ditemukan atau tidak dapat diubah" },
        { status: 404 }
      );
    }

    // 7. Upload file ke Supabase Storage
    const filePath = `${employee.id}/${claim.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      return NextResponse.json(
        { message: "Gagal mengunggah bukti transaksi" },
        { status: 500 }
      );
    }

    // 8. Simpan lokasi file ke database
    try {
      await prisma.claim.update({
        where: { id: claim.id },
        data: { receiptUrl: filePath },
      });
    } catch (dbError) {
      // Hapus file jika penyimpanan database gagal
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      throw dbError;
    }

    return NextResponse.json({
      message: "Bukti transaksi berhasil diunggah",
      receiptUrl: filePath,
    });
  } catch (error) {
    console.error("Claim upload error:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengunggah bukti transaksi" },
      { status: 500 }
    );
  }
}

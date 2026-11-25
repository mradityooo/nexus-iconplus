
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET_NAME = "inspection-photos";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Periksa login
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 2. Ambil file dari FormData
    const formData = await request.formData();
    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return Response.json(
        { message: "File foto tidak ditemukan." },
        { status: 400 }
      );
    }

    // 3. Validasi tipe file
    const extension = allowedTypes[file.type];

    if (!extension) {
      return Response.json(
        { message: "Format foto harus JPG, PNG, atau WEBP." },
        { status: 400 }
      );
    }

    // 4. Validasi ukuran
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return Response.json(
        { message: "Ukuran foto harus lebih dari 0 dan maksimal 5 MB." },
        { status: 400 }
      );
    }

    // 5. Pastikan inspeksi milik pengguna yang login
    const inspection = await prisma.inspection.findFirst({
      where: {
        id,
        employee: {
          userId: session.user.id,
        },
      },
    });

    if (!inspection) {
      return Response.json(
        { message: "Data inspeksi tidak ditemukan atau akses ditolak." },
        { status: 404 }
      );
    }

    // 6. Buat nama file unik
    const filePath = `${inspection.id}/${Date.now()}.${extension}`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 7. Upload ke Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      return Response.json(
        { message: "Gagal mengunggah foto ke Supabase Storage." },
        { status: 500 }
      );
    }

    // 8. Simpan path foto ke database
    try {
      await prisma.inspection.update({
        where: { id: inspection.id },
        data: { photoPath: filePath },
      });
    } catch (databaseError) {
      // Hapus file jika penyimpanan database gagal
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      throw databaseError;
    }

    return Response.json({
      message: "Foto inspeksi berhasil diunggah.",
      data: {
        photoPath: filePath,
      },
    });
  } catch (error) {
    console.error("Inspection photo upload error:", error);

    return Response.json(
      { message: "Terjadi kesalahan saat mengunggah foto." },
      { status: 500 }
    );
  }
}

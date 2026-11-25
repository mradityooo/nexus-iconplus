
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const BUCKET_NAME = "claim-receipts";

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    // 1. Validasi login
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ambil ID klaim
    const { id } = await context.params;

    // 3. Cari karyawan yang sedang login
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    // 4. Pastikan klaim milik karyawan tersebut
    const claim = await prisma.claim.findFirst({
      where: {
        id,
        employeeId: employee.id,
      },
      select: {
        receiptUrl: true,
      },
    });

    if (!claim || !claim.receiptUrl) {
      return NextResponse.json(
        { message: "Bukti transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // 5. Buat signed URL yang berlaku 60 detik
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(claim.receiptUrl, 60);

    if (error || !data?.signedUrl) {
      console.error("CREATE SIGNED URL ERROR:", error);

      return NextResponse.json(
        { message: "Gagal membuka bukti transaksi" },
        { status: 500 }
      );
    }

    // 6. Arahkan browser ke file
    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error("VIEW CLAIM RECEIPT ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuka bukti transaksi" },
      { status: 500 }
    );
  }
}

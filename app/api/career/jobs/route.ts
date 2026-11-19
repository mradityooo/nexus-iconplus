
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Periksa akun yang sedang login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        // 2. Ambil lowongan aktif dari Supabase
        const jobs = await prisma.careerJob.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                deadline: "asc",
            },
        });

        // 3. Kirim data ke halaman Career Planning
        return NextResponse.json({ jobs });
    } catch (error) {
        console.error("GET Career Jobs error:", error);

        return NextResponse.json(
            { error: "Gagal mengambil data lowongan" },
            { status: 500 }
        );
    }
}

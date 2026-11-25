
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Periksa apakah pengguna sudah login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        // 2. Ambil ID pengajuan dari URL
        const { id } = await params;

        const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (!uuidPattern.test(id)) {
            return NextResponse.json(
                { error: "ID pengajuan tidak valid" },
                { status: 400 }
            );
        }

        // 3. Cari data karyawan berdasarkan akun login
        const employee = await prisma.employee.findUnique({
            where: { userId: session.user.id },
            select: { id: true },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Data karyawan tidak ditemukan" },
                { status: 404 }
            );
        }

        // 4. Hapus hanya pengajuan milik karyawan ini
        const result = await prisma.wfaRequest.deleteMany({
            where: {
                id,
                employeeId: employee.id,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Pengajuan WFA tidak ditemukan" },
                { status: 404 }
            );
        }

        // 5. Kirim respons berhasil
        return NextResponse.json({
            message: "Pengajuan WFA berhasil dihapus",
        });
    } catch (error) {
        console.error("DELETE WFA error:", error);

        return NextResponse.json(
            { error: "Gagal menghapus pengajuan WFA" },
            { status: 500 }
        );
    }
}

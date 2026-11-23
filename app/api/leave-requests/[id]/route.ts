
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Pastikan pengguna sudah login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Ambil ID pengajuan dari URL
        const { id } = await context.params;

        // Pastikan format ID adalah UUID
        if (
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        ) {
            return NextResponse.json(
                { error: "ID pengajuan tidak valid" },
                { status: 400 }
            );
        }

        // 3. Cari karyawan yang sedang login
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

        // 4. Cari pengajuan milik karyawan tersebut
        const existing = await prisma.leaveRequest.findFirst({
            where: {
                id,
                employeeId: employee.id,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Pengajuan cuti tidak ditemukan" },
                { status: 404 }
            );
        }

        // 5. Hanya pengajuan PENDING yang boleh dihapus
        if (existing.status !== "PENDING") {
            return NextResponse.json(
                { error: "Pengajuan yang sudah diproses tidak dapat dihapus" },
                { status: 409 }
            );
        }

        // 6. Hapus dari Supabase dengan validasi status
        const result = await prisma.leaveRequest.deleteMany({
            where: {
                id,
                employeeId: employee.id,
                status: "PENDING",
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Pengajuan tidak dapat dihapus" },
                { status: 409 }
            );
        }

        // 7. Kirim respons berhasil
        return NextResponse.json({
            message: "Pengajuan cuti berhasil dihapus",
        });
    } catch (error) {
        console.error("Gagal menghapus pengajuan cuti:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

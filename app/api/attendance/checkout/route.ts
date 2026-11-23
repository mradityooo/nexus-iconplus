
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        // 1. Pastikan pengguna sudah login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Cari identitas karyawan yang login
        const employee = await prisma.employee.findUnique({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Data karyawan tidak ditemukan" },
                { status: 404 }
            );
        }

        // 3. Ambil waktu server dan tanggal berdasarkan WIB
        const now = new Date();

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(now);

        const date = Object.fromEntries(
            parts.map((part) => [part.type, part.value])
        );

        const attendanceDate = new Date(
            `${date.year}-${date.month}-${date.day}T00:00:00.000Z`
        );

        // 4. Cari absensi karyawan untuk hari ini
        const existing = await prisma.attendance.findUnique({
            where: {
                employeeId_attendanceDate: {
                    employeeId: employee.id,
                    attendanceDate,
                },
            },
        });

        // 5. Pastikan sudah Check-in
        if (!existing) {
            return NextResponse.json(
                { error: "Kamu belum check-in hari ini" },
                { status: 404 }
            );
        }

        // 6. Pastikan belum Check-out
        if (existing.checkOutAt) {
            return NextResponse.json(
                { error: "Kamu sudah check-out hari ini" },
                { status: 409 }
            );
        }

        // 7. Simpan jam Check-out, tanpa membuat absensi baru
        const result = await prisma.attendance.updateMany({
            where: {
                id: existing.id,
                checkOutAt: null,
            },
            data: {
                checkOutAt: now,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Kamu sudah check-out hari ini" },
                { status: 409 }
            );
        }

        const attendance = await prisma.attendance.findUnique({
            where: {
                id: existing.id,
            },
        });

        return NextResponse.json({
            message: "Check-out berhasil",
            attendance,
        });
    } catch (error) {
        console.error("Gagal check-out:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

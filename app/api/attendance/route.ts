
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Periksa pengguna yang sedang login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Cari data karyawan berdasarkan akun login
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

        // 3. Ambil riwayat absensi karyawan tersebut
        const attendances = await prisma.attendance.findMany({
            where: {
                employeeId: employee.id,
            },
            orderBy: {
                attendanceDate: "desc",
            },
        });

        // 4. Kirim data absensi ke frontend
        return NextResponse.json({ attendances });
    } catch (error) {
        console.error("Gagal mengambil absensi:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}


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

        // 2. Cari identitas karyawan
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

        // 3. Ambil waktu server dalam zona WIB
        const now = new Date();

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        }).formatToParts(now);

        const time = Object.fromEntries(
            parts.map((part) => [part.type, part.value])
        );

        // 4. Tentukan tanggal absensi berdasarkan WIB
        const attendanceDate = new Date(
            `${time.year}-${time.month}-${time.day}T00:00:00.000Z`
        );

        // 5. Tentukan status berdasarkan jam masuk
        const checkInTime = `${time.hour}:${time.minute}`;
        const status = checkInTime > "08:00" ? "LATE" : "PRESENT";

        // 6. Simpan absensi ke Supabase
        const attendance = await prisma.attendance.create({
            data: {
                employeeId: employee.id,
                attendanceDate,
                checkInAt: now,
                status,
            },
        });

        return NextResponse.json(
            {
                message: "Check-in berhasil",
                attendance,
            },
            { status: 201 }
        );
    } catch (error) {
        // Mencegah check-in lebih dari sekali pada tanggal sama
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Kamu sudah check-in hari ini" },
                { status: 409 }
            );
        }

        console.error("Gagal check-in:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

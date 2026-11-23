
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

        // 3. Ambil riwayat pengajuan cuti milik karyawan
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                employeeId: employee.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // 4. Kirim hasil ke frontend
        return NextResponse.json({ leaveRequests });
    } catch (error) {
        console.error("Gagal mengambil pengajuan cuti:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        // 1. Periksa sesi pengguna
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

        // 3. Ambil data dari formulir
        let body;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Format JSON tidak valid" },
                { status: 400 }
            );
        }

        const { type, startDate, endDate, reason } = body ?? {};

        // 4. Sesuaikan jenis cuti dengan enum Prisma
        const leaveTypes = {
            "Annual Leave": "ANNUAL",
            "Sick Leave": "SICK",
            "Personal Leave": "PERSONAL",
            "Emergency Leave": "EMERGENCY",
        } as const;

        const leaveType =
            typeof type === "string"
                ? leaveTypes[type as keyof typeof leaveTypes]
                : undefined;

        if (!leaveType) {
            return NextResponse.json(
                { error: "Jenis cuti tidak valid" },
                { status: 400 }
            );
        }

        // 5. Validasi alasan dan tanggal
        if (typeof reason !== "string" || !reason.trim()) {
            return NextResponse.json(
                { error: "Alasan cuti wajib diisi" },
                { status: 400 }
            );
        }

        function parseDate(value: unknown) {
            if (
                typeof value !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(value)
            ) {
                return null;
            }

            const date = new Date(`${value}T00:00:00.000Z`);

            return !Number.isNaN(date.getTime()) &&
                date.toISOString().slice(0, 10) === value
                ? date
                : null;
        }

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        if (!start || !end || end < start) {
            return NextResponse.json(
                { error: "Tanggal pengajuan tidak valid" },
                { status: 400 }
            );
        }

        // 6. Cegah pengajuan tanggal yang sudah lewat (WIB)
        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).formatToParts(new Date());

        const today = Object.fromEntries(
            parts.map((part) => [part.type, part.value])
        );

        const todayString =
            `${today.year}-${today.month}-${today.day}`;

        if (startDate < todayString) {
            return NextResponse.json(
                { error: "Tanggal mulai tidak boleh sudah lewat" },
                { status: 400 }
            );
        }

        // 7. Hitung jumlah hari secara inklusif
        const days =
            Math.round(
                (end.getTime() - start.getTime()) / 86400000
            ) + 1;

        // 8. Cegah pengajuan pada tanggal yang bertabrakan
        const overlapping = await prisma.leaveRequest.findFirst({
            where: {
                employeeId: employee.id,
                status: { in: ["PENDING", "APPROVED"] },
                startDate: { lte: end },
                endDate: { gte: start },
            },
        });

        if (overlapping) {
            return NextResponse.json(
                { error: "Tanggal cuti bertabrakan dengan pengajuan lain" },
                { status: 409 }
            );
        }

        // 9. Validasi kuota cuti tahunan sementara: 12 hari
        if (leaveType === "ANNUAL") {
            const used = await prisma.leaveRequest.aggregate({
                where: {
                    employeeId: employee.id,
                    type: "ANNUAL",
                    status: { in: ["PENDING", "APPROVED"] },
                },
                _sum: { days: true },
            });

            const remaining = 12 - (used._sum.days ?? 0);

            if (days > remaining) {
                return NextResponse.json(
                    { error: "Sisa kuota cuti tahunan tidak mencukupi" },
                    { status: 400 }
                );
            }
        }

        // 10. Simpan pengajuan ke Supabase
        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                employeeId: employee.id,
                type: leaveType,
                startDate: start,
                endDate: end,
                days,
                reason: reason.trim(),
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                message: "Pengajuan cuti berhasil",
                leaveRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Gagal mengajukan cuti:", error);

        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

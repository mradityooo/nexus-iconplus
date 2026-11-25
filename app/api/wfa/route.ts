
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

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

        const requests = await prisma.wfaRequest.findMany({
            where: { employeeId: employee.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("GET WFA error:", error);

        return NextResponse.json(
            { error: "Gagal mengambil data WFA" },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        // 1. Periksa akun yang sedang login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        // 2. Ambil data yang dikirim dari form WFA
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { error: "Format data tidak valid" },
                { status: 400 }
            );
        }

        const {
            workLocation,
            locationDetails,
            startDate,
            endDate,
            reason,
            notes,
        } = body;

        // 3. Validasi data wajib
        if (
            typeof workLocation !== "string" ||
            !workLocation.trim() ||
            typeof locationDetails !== "string" ||
            !locationDetails.trim() ||
            typeof reason !== "string" ||
            !reason.trim() ||
            typeof startDate !== "string" ||
            typeof endDate !== "string"
        ) {
            return NextResponse.json(
                { error: "Lengkapi semua data wajib" },
                { status: 400 }
            );
        }

        // 4. Validasi format dan urutan tanggal
        const validDate = (value: string) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

            const date = new Date(`${value}T00:00:00.000Z`);

            return (
                !Number.isNaN(date.getTime()) &&
                date.toISOString().slice(0, 10) === value
            );
        };

        if (
            !validDate(startDate) ||
            !validDate(endDate) ||
            startDate > endDate
        ) {
            return NextResponse.json(
                { error: "Tanggal pengajuan tidak valid" },
                { status: 400 }
            );
        }

        // 5. Cari karyawan berdasarkan akun login
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

        // 6. Simpan pengajuan ke database
        const createdRequest = await prisma.wfaRequest.create({
            data: {
                employeeId: employee.id,
                workLocation: workLocation.trim(),
                locationDetails: locationDetails.trim(),
                startDate: new Date(`${startDate}T00:00:00.000Z`),
                endDate: new Date(`${endDate}T00:00:00.000Z`),
                reason: reason.trim(),
                notes: typeof notes === "string" ? notes.trim() || null : null,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            { message: "Pengajuan WFA berhasil disimpan", request: createdRequest },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST WFA error:", error);

        return NextResponse.json(
            { error: "Gagal menyimpan pengajuan WFA" },
            { status: 500 }
        );
    }
}


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

        // 2. Cari karyawan berdasarkan akun login
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

        // 3. Ambil riwayat Request dari Supabase
        const requests = await prisma.employeeRequest.findMany({
            where: { employeeId: employee.id },
            orderBy: { submittedAt: "desc" },
        });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("GET Request error:", error);

        return NextResponse.json(
            { error: "Gagal mengambil data Request" },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    try {
        // 1. Periksa akun yang login
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Silakan login terlebih dahulu" },
                { status: 401 }
            );
        }

        // 2. Ambil data dari form Request
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { error: "Format data tidak valid" },
                { status: 400 }
            );
        }

        const { title, category, priority, neededDate, description } = body;

        // 3. Validasi data wajib
        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof category !== "string" ||
            typeof priority !== "string" ||
            typeof neededDate !== "string" ||
            typeof description !== "string" ||
            !description.trim()
        ) {
            return NextResponse.json(
                { error: "Lengkapi semua data wajib" },
                { status: 400 }
            );
        }

        const allowedCategories = [
            "IT & Equipment",
            "System Access",
            "Facility",
            "Administration",
            "Other",
        ];

        const allowedPriorities = ["Low", "Normal", "High", "Urgent"];

        if (
            !allowedCategories.includes(category) ||
            !allowedPriorities.includes(priority)
        ) {
            return NextResponse.json(
                { error: "Kategori atau prioritas tidak valid" },
                { status: 400 }
            );
        }

        // 4. Periksa tanggal kebutuhan
        const date = new Date(`${neededDate}T00:00:00.000Z`);

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(neededDate) ||
            Number.isNaN(date.getTime()) ||
            date.toISOString().slice(0, 10) !== neededDate
        ) {
            return NextResponse.json(
                { error: "Tanggal kebutuhan tidak valid" },
                { status: 400 }
            );
        }

        const todayWib = new Date(
            Date.now() + 7 * 60 * 60 * 1000
        ).toISOString().slice(0, 10);

        if (neededDate < todayWib) {
            return NextResponse.json(
                { error: "Tanggal kebutuhan tidak boleh lewat" },
                { status: 400 }
            );
        }

        // 5. Cari data karyawan
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

        // 6. Simpan Request ke Supabase
        const createdRequest = await prisma.employeeRequest.create({
            data: {
                employeeId: employee.id,
                title: title.trim(),
                category,
                priority: priority.toUpperCase() as
                    "LOW" | "NORMAL" | "HIGH" | "URGENT",
                neededDate: date,
                description: description.trim(),
                status: "PENDING",
            },
        });

        return NextResponse.json(
            {
                message: "Pengajuan Request berhasil disimpan",
                request: createdRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST Request error:", error);

        return NextResponse.json(
            { error: "Gagal menyimpan pengajuan Request" },
            { status: 500 }
        );
    }
}

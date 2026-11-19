
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

        // 2. Cari data karyawan
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

        // 3. Ambil riwayat lamaran milik karyawan
        const applications = await prisma.careerApplication.findMany({
            where: {
                employeeId: employee.id,
            },
            include: {
                job: true,
            },
            orderBy: {
                appliedAt: "desc",
            },
        });

        // 4. Kirim hasil ke halaman Career Planning
        return NextResponse.json({ applications });
    } catch (error) {
        console.error("GET Career Applications error:", error);

        return NextResponse.json(
            { error: "Gagal mengambil riwayat lamaran" },
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

        // 2. Ambil ID lowongan dari halaman Career Planning
        const body = await request.json().catch(() => null);
        const jobId = body?.jobId;

        if (!Number.isInteger(jobId) || jobId <= 0) {
            return NextResponse.json(
                { error: "ID lowongan tidak valid" },
                { status: 400 }
            );
        }

        // 3. Cari karyawan berdasarkan akun login
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

        // 4. Periksa lowongan masih tersedia
        const todayWib = new Date(
            Date.now() + 7 * 60 * 60 * 1000
        ).toISOString().slice(0, 10);

        const job = await prisma.careerJob.findFirst({
            where: {
                id: jobId,
                isActive: true,
                deadline: {
                    gte: new Date(`${todayWib}T00:00:00.000Z`),
                },
            },
        });

        if (!job) {
            return NextResponse.json(
                { error: "Lowongan tidak tersedia atau sudah ditutup" },
                { status: 404 }
            );
        }

        // 5. Periksa apakah sudah pernah melamar
        const existingApplication =
            await prisma.careerApplication.findUnique({
                where: {
                    employeeId_jobId: {
                        employeeId: employee.id,
                        jobId,
                    },
                },
            });

        if (existingApplication) {
            return NextResponse.json(
                { error: "Anda sudah melamar posisi ini" },
                { status: 409 }
            );
        }

        // 6. Simpan lamaran ke Supabase
        const application = await prisma.careerApplication.create({
            data: {
                employeeId: employee.id,
                jobId,
                status: "SUBMITTED",
            },
            include: {
                job: true,
            },
        });

        return NextResponse.json(
            {
                message: "Lamaran berhasil dikirim",
                application,
            },
            { status: 201 }
        );
    } catch (error) {
        // Antisipasi lamaran ganda dari dua request bersamaan
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Anda sudah melamar posisi ini" },
                { status: 409 }
            );
        }

        console.error("POST Career Application error:", error);

        return NextResponse.json(
            { error: "Gagal menyimpan lamaran" },
            { status: 500 }
        );
    }
}


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET: Mengambil seluruh klaim milik karyawan yang login
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const claims = await prisma.claim.findMany({
      where: {
        employeeId: employee.id,
        status: "DRAFT",
        requestId: null,
      },
      include: {
        request: {
          select: {
            id: true,
            requestNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            reviewNote: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error("GET CLAIMS ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data klaim" },
      { status: 500 }
    );
  }
}

// POST: Membuat item klaim sebagai DRAFT
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      category,
      transactionDate,
      reference,
      description,
      amount,
      fuelType,
      liters,
      pricePerLiter,
      stationLocation,
      notes,
    } = body;

    const validCategories = [
      "CAR_WASH",
      "MEALS",
      "TOLL_FEE",
      "FUEL",
      "OTHERS",
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { message: "Kategori klaim tidak valid" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(transactionDate);
    const parsedAmount = Number(amount);

    if (
      !transactionDate ||
      Number.isNaN(parsedDate.getTime()) ||
      !description?.trim() ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return NextResponse.json(
        { message: "Data pengajuan belum lengkap atau tidak valid" },
        { status: 400 }
      );
    }

    // Hanya item DRAFT yang boleh ditambahkan
    const claim = await prisma.claim.create({
      data: {
        employeeId: employee.id,
        category,
        transactionDate: parsedDate,
        reference: reference || null,
        description: description.trim(),
        amount: parsedAmount,
        fuelType: category === "FUEL" ? fuelType || null : null,
        liters:
          category === "FUEL" && liters != null
            ? Number(liters)
            : null,
        pricePerLiter:
          category === "FUEL" && pricePerLiter != null
            ? Number(pricePerLiter)
            : null,
        stationLocation:
          category === "FUEL" ? stationLocation || null : null,
        notes: notes || null,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      {
        message: "Item klaim berhasil disimpan sebagai draft",
        data: claim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST CLAIM ERROR:", error);

    return NextResponse.json(
      { message: "Gagal membuat item klaim" },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus item DRAFT milik karyawan
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan" },
        { status: 404 }
      );
    }

    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { message: "ID klaim tidak valid" },
        { status: 400 }
      );
    }

    const deleted = await prisma.claim.deleteMany({
      where: {
        id,
        employeeId: employee.id,
        status: "DRAFT",
        requestId: null,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Item klaim tidak ditemukan atau sudah disubmit" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Item klaim berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE CLAIM ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus item klaim" },
      { status: 500 }
    );
  }
}

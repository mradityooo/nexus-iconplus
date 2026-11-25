
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

// POST: Membuat pengajuan klaim baru
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

    if (
      !transactionDate ||
      !description?.trim() ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return NextResponse.json(
        { message: "Data pengajuan belum lengkap atau tidak valid" },
        { status: 400 }
      );
    }

    const claim = await prisma.claim.create({
      data: {
        employeeId: employee.id,
        category,
        transactionDate: new Date(transactionDate),
        reference: reference || null,
        description: description.trim(),
        amount: Number(amount),
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
      },
    });

    return NextResponse.json(
      {
        message: "Pengajuan klaim berhasil dibuat",
        data: claim,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST CLAIM ERROR:", error);

    return NextResponse.json(
      { message: "Gagal membuat pengajuan klaim" },
      { status: 500 }
    );
  }
}


// DELETE: Menghapus klaim milik karyawan yang login
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
        status: "PENDING",
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Klaim tidak ditemukan atau tidak dapat dihapus" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Klaim berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE CLAIM ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus klaim" },
      { status: 500 }
    );
  }
}

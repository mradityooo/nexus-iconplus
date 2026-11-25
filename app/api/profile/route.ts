
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json(
    { message: "Silakan login terlebih dahulu." },
    { status: 401 }
  );
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employee: true },
    });

    if (!user || !user.employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    const employee = user.employee;

    return NextResponse.json({
      name: employee.fullName,
      employeeId: employee.employeeCode,
      email: user.email,
      phone: employee.phone ?? "",
      department: employee.department ?? "",
      position: employee.position ?? "",
      location: employee.workLocation ?? "",
      joinDate: employee.joinDate
        ? employee.joinDate.toISOString().slice(0, 10)
        : "",
    });
  } catch (error) {
    console.error("GET /api/profile:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data profil." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorized();
    }

    const body = await request.json();

    const allowedFields = [
      "name",
      "phone",
      "department",
      "position",
      "location",
    ];

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).length === 0 ||
      Object.keys(body).some(
        (key) => !allowedFields.includes(key)
      )
    ) {
      return NextResponse.json(
        { message: "Data yang dikirim tidak valid." },
        { status: 400 }
      );
    }

    for (const key of allowedFields) {
      if (
        key in body &&
        (typeof body[key] !== "string" ||
          body[key].trim() === "")
      ) {
        return NextResponse.json(
          { message: `Kolom ${key} tidak boleh kosong.` },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { employee: true },
    });

    if (!user || !user.employee) {
      return NextResponse.json(
        { message: "Data karyawan tidak ditemukan." },
        { status: 404 }
      );
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: user.employee.id },
      data: {
        ...(body.name !== undefined
          ? { fullName: body.name.trim() }
          : {}),
        ...(body.phone !== undefined
          ? { phone: body.phone.trim() }
          : {}),
        ...(body.department !== undefined
          ? { department: body.department.trim() }
          : {}),
        ...(body.position !== undefined
          ? { position: body.position.trim() }
          : {}),
        ...(body.location !== undefined
          ? { workLocation: body.location.trim() }
          : {}),
      },
    });

    const profile = {
      name: updatedEmployee.fullName,
      employeeId: updatedEmployee.employeeCode,
      email: user.email,
      phone: updatedEmployee.phone ?? "",
      department: updatedEmployee.department ?? "",
      position: updatedEmployee.position ?? "",
      location: updatedEmployee.workLocation ?? "",
      joinDate: updatedEmployee.joinDate
        ? updatedEmployee.joinDate.toISOString().slice(0, 10)
        : "",
    };

    return NextResponse.json({
      message: "Profil berhasil diperbarui.",
      profile,
    });
  } catch (error) {
    console.error("PATCH /api/profile:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui profil." },
      { status: 500 }
    );
  }
}

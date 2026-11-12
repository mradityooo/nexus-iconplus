
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const templates = await prisma.inspectionTemplate.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: templates,
    });
} catch (error) {
  console.error("GET inspection templates error:", error);

  return NextResponse.json(
    {
      message: "Gagal mengambil checklist inspeksi",
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}
}

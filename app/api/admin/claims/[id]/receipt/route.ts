
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Verifikasi session
    const session = await auth();

    if (!session?.user || !["GA", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Ambil data klaim
    const claim = await prisma.claim.findUnique({
      where: { id },
      select: {
        id: true,
        receiptUrl: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { message: "Claim not found" },
        { status: 404 }
      );
    }

    if (!claim.receiptUrl) {
      return NextResponse.json(
        { message: "Receipt not found" },
        { status: 404 }
      );
    }

    // Generate signed URL selama 60 detik
    const { data, error } = await supabaseAdmin.storage
      .from("claim-receipts")
      .createSignedUrl(claim.receiptUrl, 60);

    if (error || !data?.signedUrl) {
      console.error("Supabase receipt error:", error);

      return NextResponse.json(
        { message: "Failed to access receipt" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    console.error("Receipt API error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

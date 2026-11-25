import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Employees API is ready",
    data: [],
  });
}
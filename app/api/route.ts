import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  return new NextResponse(null, {status: 405});
}
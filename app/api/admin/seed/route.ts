import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Demo properties seeding is disabled. Please upload real properties via the Admin portal.",
    count: 0,
  });
}

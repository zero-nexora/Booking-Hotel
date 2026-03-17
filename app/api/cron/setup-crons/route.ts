import { env } from "@/lib/env";
import { scheduleCrons } from "@/lib/qstash";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await scheduleCrons();
  return NextResponse.json({ success: true });
}

// curl "https://booking-hotel-puce.vercel.app/api/cron/setup-crons?secret=your_secret"

import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(categories);
    return NextResponse.json(all);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch", err }, { status: 500 });
  }
}

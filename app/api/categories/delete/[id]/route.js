import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await db.delete(categories).where(eq(categories.id, Number(id)));
    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed", err }, { status: 500 });
  }
}

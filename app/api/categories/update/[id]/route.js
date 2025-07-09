import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { name, description } = body;

  try {
    await db
      .update(categories)
      .set({ name, description })
      .where(eq(categories.id, Number(id)));
    return NextResponse.json({ message: "Category updated" });
  } catch (err) {
    return NextResponse.json({ error: "Update failed", err }, { status: 500 });
  }
}

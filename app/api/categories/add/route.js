import { db } from "../../../../lib/db";
import { categories } from "../../../../lib/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { name, description } = body;
  console.log(name, description)

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const result = await db
      .insert(categories)
      .values({ name, description: description || null });
    console.log("Insert result:", result);
    
    return NextResponse.json({ message: "Category added" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add", err }, { status: 500 });
  }
}

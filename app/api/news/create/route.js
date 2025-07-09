import { db } from "../../../../lib/db";
import { news } from "../../../..//lib/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json(); // ✅ expect JSON not formData

    const {
      title,
      category,
      author,
      status,
      publishDate,
      content,
      isSidebar,
      isBreaking,
      isFeatured,
      images, // this should be an array or JSON string
    } = data;

    await db.insert(news).values({
      title,
      category,
      author,
      status,
      content,
      isSidebar,
      isBreaking,
      isFeatured,
      publishedAt: new Date(publishDate || Date.now()),
      images: typeof images === "string" ? images : JSON.stringify(images),
    });

    return NextResponse.json({ message: "News created" }, { status: 201 });
  } catch (err) {
    console.error("Create error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

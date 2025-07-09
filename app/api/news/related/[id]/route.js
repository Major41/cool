// app/api/news/related/[id]/route.js

import { db } from "../../../../../lib/db";
import { news } from "../../../../../lib/schema";
import { and, eq, ne } from "drizzle-orm";

export async function GET(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "6");

  if (!id || !category) {
    return new Response(JSON.stringify({ message: "Missing parameters" }), {
      status: 400,
    });
  }

  try {
    const result = await db
      .select()
      .from(news)
      .where(and(eq(news.category, category), ne(news.id, Number(id))))
      .limit(limit);

    const articles = result.map((item) => ({
      ...item,
      images:
        typeof item.images === "string" ? JSON.parse(item.images) : item.images,
    }));

    return new Response(JSON.stringify({ articles }), { status: 200 });
  } catch (err) {
    console.error("Fetch related articles error:", err);
    return new Response(
      JSON.stringify({ message: "Failed to fetch related articles" }),
      {
        status: 500,
      }
    );
  }
}

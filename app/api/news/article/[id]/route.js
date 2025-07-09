// app/api/news/article/[id]/route.js

import { db } from "../../../../../lib/db";
import { news } from "../../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ message: "Missing article ID" }), {
      status: 400,
    });
  }

  try {
    const result = await db
      .select()
      .from(news)
      .where(eq(news.id, Number(id)));
    const article = result[0];

    if (!article) {
      return new Response(JSON.stringify({ message: "Article not found" }), {
        status: 404,
      });
    }

    // Parse images and tags if stored as strings
    if (typeof article.images === "string") {
      article.images = JSON.parse(article.images);
    }

    if (typeof article.tags === "string") {
      article.tags = JSON.parse(article.tags);
    }

    return new Response(JSON.stringify(article), {
      status: 200,
    });
  } catch (err) {
    console.error("Article fetch error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

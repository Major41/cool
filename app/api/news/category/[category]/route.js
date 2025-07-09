// app/api/news/category/[category]/route.js
import { db } from "@/lib/db";
import { news } from "@/lib/schema";
import { eq, desc, count } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { category } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // 1. Fetch paginated articles
    const articles = await db
      .select()
      .from(news)
      .where(eq(news.category, category))
      .orderBy(desc(news.publishedAt))
      .limit(limit)
      .offset(offset);

    // 2. Count total articles in that category
    const totalCountResult = await db
      .select({ count: count() })
      .from(news)
      .where(eq(news.category, category));
    const totalArticles = totalCountResult[0].count;

      const totalPages = Math.ceil(totalArticles / limit);
      
      const parsedArticles = articles.map((article) => ({
        ...article,
        images:
          typeof article.images === "string"
            ? JSON.parse(article.images)
            : article.images,
      }));
      

    return new Response(
      JSON.stringify({
        articles: parsedArticles,
        totalArticles,
        totalPages,
        currentPage: page,
        categoryName: category,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Fetch category error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch category articles" }),
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { news, categories } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // 1. Total articles
    const totalArticles = await db.select().from(news);
    const totalArticlesCount = totalArticles.length;

    // 2. Published today
    const publishedTodayCount = (
      await db
        .select()
        .from(news)
        .where(
          and(
            gte(news.publishedAt, startOfDay),
            lte(news.publishedAt, endOfDay),
            eq(news.status, "Published")
          )
        )
    ).length;

    // 3. Total categories
    const totalCategories = await db.select().from(categories);
    const totalCategoriesCount = totalCategories.length;

    // 4. Draft articles
    const draftArticlesCount = (
      await db.select().from(news).where(eq(news.status, "Draft"))
    ).length;

    const stats = [
      {
        title: "Total Articles",
        value: totalArticlesCount.toLocaleString(),
        description: "All-time published & draft articles",
        icon: "FileText",
        color: "bg-[#b51c1c]",
      },
      {
        title: "Published Today",
        value: publishedTodayCount.toString(),
        description: "Articles published today",
        icon: "Calendar",
        color: "bg-[#052461]",
      },
      {
        title: "Categories",
        value: totalCategoriesCount.toString(),
        description: "Active categories",
        icon: "Users",
        color: "bg-[#111827]",
      },
      {
        title: "Draft Articles",
        value: draftArticlesCount.toString(),
        description: "Unpublished articles in draft",
        icon: "FileWarning",
        color: "bg-gradient-to-r from-[#b51c1c] to-[#052461]",
      },
    ];

    return new Response(JSON.stringify(stats), { status: 200 });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new Response(
      JSON.stringify({ message: "Failed to load admin dashboard statistics." }),
      { status: 500 }
    );
  }
};

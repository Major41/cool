import { db } from "@/lib/db";
import { news } from "@/lib/schema";

export async function GET() {
  try {
    const articles = await db.select().from(news).orderBy(news.publishedAt);
    const parsed = articles.map((a) => ({
      ...a,
      images: safeJsonParse(a.images),
    }));
    return new Response(JSON.stringify(parsed), { status: 200 });
  } catch (err) {
    console.error("Fetch error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
}

// helper
function safeJsonParse(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value ? [value] : [];
  }
}


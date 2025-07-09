import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { news } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(req, { params }) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const imageFiles = formData.getAll("images");
    const savedPaths = [];

    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${uuidv4()}-${file.name}`;
      const filepath = path.join(process.cwd(), "public/uploads", filename);
      await writeFile(filepath, buffer);
      savedPaths.push(`/uploads/${filename}`);
    }

    await db
      .update(news)
      .set({
        title: data.title,
        category: data.category,
        content: data.content,
        author: data.author,
        status: data.status,
        isSidebar: data.isSidebar === "true",
        isBreaking: data.isBreaking === "true",
        isFeatured: data.isFeatured === "true",
        publishedAt: new Date(data.publishDate || Date.now()),
        images: JSON.stringify(savedPaths),
      })
      .where(eq(news.id, parseInt(params.id)));

    return new Response(JSON.stringify({ message: "Article updated" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Update error:", err);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
}

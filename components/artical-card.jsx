"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "../components/ui/badge";

export default function ArticleCard({ article, variant = "default" }) {
  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case "Breaking":
        return "bg-[#b51c1c]";
      case "Politics":
        return "bg-[#052461]";
      case "Sports":
        return "bg-green-600";
      case "Technology":
        return "bg-purple-600";
      case "Business":
        return "bg-blue-600";
      case "Entertainment":
        return "bg-pink-600";
      default:
        return "bg-gray-600";
    }
  };

  const slug = article.title
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 5)
    .join("-")
    .replace(/[^\w-]/g, "");

  const imageUrl =
    article.images?.[0] || article.imageUrl || "/placeholder.jpg";

  // Compact version
  if (variant === "compact") {
    return (
      <Link href={`/article/${article.id}/${slug}`} className="block">
        <article className="bg-white rounded-lg shadow-md flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-full h-40 md:h-60 relative">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1 p-2">
            <p className="text-muted-foreground text-[15px] break-words leading-relaxed text-blue-900 font-extrabold">
              {article.title}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Featured version
  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.id}/${slug}`}
        className="overflow-hidden w-screen"
      >
        <article className="bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="relative w-full h-[400px] overflow-hidden">
            <Image
              src={imageUrl}
              alt="article image"
              fill="true"
              className="object-cover"
              sizes="50vw"
            />
          </div>

          <div className="p-2">
            <p className="text-2xl md:text-justify break-words leading-tight text-blue-900 font-bold w-[98%] max-w-xl mx-auto md:mx-0">
              {article.title}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Default version
  return (
    <Link href={`/article/${article.id}/${slug}`} className="block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative ">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="p-4">
          <Badge
            className={`${getCategoryBadgeColor(
              article.category
            )} text-white text-xs mb-2`}
          >
            {article.isBreaking ? "BREAKING" : article.category.toUpperCase()}
          </Badge>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{article.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

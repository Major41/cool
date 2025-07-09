"use client";

import Link from "next/link";
import ArticleCard from "./artical-card";

export default function CategorySection({
  title,
  category,
  articles,
  linkColor = "text-[#052461]"
}) {
  if (!articles || !articles.length) return null;

  const [mainArticle, ...otherArticles] = articles.slice(0, 5); // First as main, 4 others

  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${linkColor}`}>{title}</h2>
        <Link
          href={`/category/${category}`}
          className={`${linkColor} hover:text-news-accent font-medium transition-colors`}
        >
          View All {title}
        </Link>
      </div>

      {/* Main Article Full Width */}
      <div className="mb-8">
        <ArticleCard article={mainArticle} variant="featured" />
      </div>

      {/* 4 Smaller Articles */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-1">
        {otherArticles.slice(0, 4).map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </section>
  );
}

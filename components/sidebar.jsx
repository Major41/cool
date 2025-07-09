"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


export default function Sidebar() {
  const [news] = useState([]);

  useEffect(() => {
    // const fetchNews = async () => {
    //   try {
    //     const response = await API.get("/api/news/sidebar");
    //     setNews(response.data);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchNews();
  }, []);

  return (
    <div className="space-y-4 lg:sticky top-5 h-full hidden lg:block">
      <h2 className="text-xl font-bold text-[#052461] mb-2">Trending Now</h2>

      {news?.slice(0, 5).map((article) => (
        <Link
          href={`/article/${article.id}`}
          key={article.id}
          className="flex gap-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
        >
          <Image
            src={article.images?.[0] || "/placeholder.svg"}
            alt={article.title}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {article.content}
            </p>
            <p className="text-xs text-gray-400 mt-1">{article.timeAgo}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

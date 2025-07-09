"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Hero from "../components/Hero";
import Sidebar from "../components/sidebar";
import ArticleCard from "../components/artical-card";

export default function HomePage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news/all");
        const data = await res.json();
        setArticles(data);
        console.log(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchNews();
  }, []);

  const featuredNews = articles.filter((article) => article.isFeatured);
  const nonFeaturedNews = articles.filter((article) => !article.isFeatured);

  const layout = [];

  for (let i = 0; i < featuredNews.length; i++) {
    const big = featuredNews[i];
    const smallSet = nonFeaturedNews.slice(i * 4, (i + 1) * 4);
    layout.push({ big, small: smallSet });
  }

  return (
    <div className="md:w-[65%] mx-auto w-screen bg-gray-100 md:p-4 border-x md:border-8 border-gray-200 overflow-hidden">
      <Header />
      <Hero />
      <div className="sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 space-y-12">
            {layout.map((group, index) => (
              <div key={index} className="mb-10">
                <ArticleCard article={group.big} variant="featured" />
                <div className="grid grid-cols-2 h-full md:grid-cols-2 lg:grid-cols-2 gap-2 ">
                  {group.small.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
}

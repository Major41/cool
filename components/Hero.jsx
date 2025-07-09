"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Skeleton } from "../components/ui/skeleton";
import Image from "next/image";
export default function Hero() {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/news/all");
        const data = await res.json();
        setHeroData(data);
      } catch (err) {
        setError(err?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // useEffect(() => {
  //   const fetchNews = async () => {
  //     try {
  //       const res = await fetch("/api/news/all");
  //       const data = await res.json();
  //       setArticles(data);
  //       console.log(data)
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchNews();
  // }, []);

  if (loading) {
    return (
      <section className="w-full py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-24 w-32 rounded-lg flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !heroData) {
    return (
      <section className="w-full py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">
              Failed to load news
            </h2>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) return null;

  const featuredArticle = heroData[0];
  // const secondaryArticles = heroData.slice(1);

  const slug = featuredArticle.title
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 5)
    .join("-")
    .replace(/[^\w-]/g, "");

  // const secondaryArticlesWithSlugs = secondaryArticles.map((article) => {
  //   const slug = article.title
  //     .toLowerCase()
  //     .split(/\s+/)
  //     .slice(0, 5)
  //     .join("-")
  //     .replace(/[^\w-]/g, "");

  //   return {
  //     ...article,
  //     slug,
  //   };
  // });

  return (
    <section className="bg-background mt-2">
      <div>
        <div className="grid gap-8 lg:gap-10">
          <div className="space-y-2 lg:col-span-2">
            <Link
              href={`/article/${featuredArticle.id}/${slug}`}
              className="group block"
            >
              <h1 className="text-2xl md:text-3xl mb-2 hidden md:block font-bold text-red-700 tracking-tight group-hover:text-blue-950 transition-colors">
                {featuredArticle.title}
              </h1>
              <div className="relative overflow-hidden">
                <img
                  src={featuredArticle.images[0] || "/placeholder.svg"}
                  alt={featuredArticle.title}
                  height={600}
                  
                  className="object-cover w-screen lg:w-full mx-auto h-[400px] transition-transform duration-300"
                />
              </div>
              <p className="text-2xl md:text-3xl md:text-justify break-words w-[97%] md:hidden mx-auto font-bold text-blue-900 tracking-tight group-hover:text-blue-950 transition-colors">
                {featuredArticle.title}
              </p>
              <p className="text-xl font-bold hidden md:block text-justify break-words text-blue-900 tracking-tight md:font-normal md:text-black md:text-[16px] group-hover:text-blue-950 transition-colors line-clamp-3">
                {featuredArticle.excerpt}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

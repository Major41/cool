"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function DashboardStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const stats = await res.json();
        setStats(stats)
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const skeletonArray = [1, 2, 3, 4];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {loading
        ? skeletonArray.map((_, index) => (
            <Card key={index} className="animate-pulse space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-300 rounded mt-4"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </Card>
          ))
        : stats.map((stat, index) => (
            <Card
              key={index}
              className="border-[#b51c1c]/20 hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#111827]">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <p className="h-4 w-4 text-white"></p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#111827]">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}

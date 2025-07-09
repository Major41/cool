"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";

function getFormattedDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return now.toLocaleString("en-US", options);
}

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState(""); // ⛔ Removed initial server-rendered value
  const [categories, setCategories] = useState([]);

  // ✅ Set date/time on client only
  useEffect(() => {
    const updateTime = () => setDateTime(getFormattedDate());
    updateTime(); // set immediately on mount
    const interval = setInterval(updateTime, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/all");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto text-sm text-gray-600 px-4 py-2 flex justify-between items-center">
        <div className="space-x-4 hidden md:block font-semibold">
          <Link href="/" className="hover:underline">
            Privacy
          </Link>
          <Link href="/" className="hover:underline">
            Feedback
          </Link>
        </div>
        {dateTime && <div className="font-semibold">{dateTime}</div>}
      </div>
      <hr className="bg-black max-w-7xl mx-auto" />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div
                className="text-2xl font-bold tracking-[1.3px]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <span className="text-red-600">Faa</span>
                <span className="text-blue-600">Fiye</span>
                <span className=" text-sm font-medium text-red-600">.com</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.name}`}
                  className="hover:text-blue-600"
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center relative"
            >
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed top-0 right-0 w-80 bg-white h-full shadow-lg p-6">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-2 text-gray-500 font-bold hover:text-red-600"
              >
                ✕
              </button>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.name}`}
                    onClick={() => setIsOpen(false)}
                    className="group relative block py-2 px-3 rounded-lg transition-all duration-200 ease-in-out text-gray-800 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md hover:scale-[1.02]"
                  >
                    <span className="relative z-10">{category.name}</span>
                    <span
                      className="absolute bottom-0 left-3 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-[80%]"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

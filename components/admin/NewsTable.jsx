"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Edit, Trash2, Search } from "lucide-react";
import { AddEditNewsModal } from "./AddEditNewsModal";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../context/AuthContext";

const statusColors = {
  Published: "bg-green-100 text-green-800",
  Draft: "bg-yellow-100 text-yellow-800",
  Scheduled: "bg-blue-100 text-blue-900",
};

export function NewsTable() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/all");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news/all");
        const data = await res.json();
        setArticles(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || article.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (article) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    // try {
    //   await API.delete(`/api/news/delete/${id}`);
    //   setArticles((prev) => prev.filter((a) => a.id !== id));
    //   toast.success("News deleted successfully");
    // } catch (error) {
    //   console.error("Delete error:", error);
    //   toast.error("Failed to delete news");
    // }
  };

  const handleSave = (articleData) => {
    if (editingArticle) {
      setArticles(
        articles.map((article) =>
          article.id === editingArticle.id
            ? { ...article, ...articleData }
            : article
        )
      );
    } else {
      const newArticle = {
        id: Math.random().toString(),
        ...articleData,
        views: 0,
      };
      setArticles([newArticle, ...articles]);
    }
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleAddNew = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#b51c1c]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#111827]">
                Article Management
              </CardTitle>
              <CardDescription>
                Manage all your news articles from one place
              </CardDescription>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-[#b51c1c] hover:bg-[#b51c1c]/90 text-white"
            >
              <Edit className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">New Article</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#b51c1c]/20 focus:border-[#b51c1c]"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 border-[#b51c1c]/20">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 border-[#b51c1c]/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.keys(statusColors).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-[#b51c1c]/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-[#111827]">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-[#111827]">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-[#111827]">
                    Author
                  </TableHead>
                  <TableHead className="font-semibold text-[#111827]">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-[#111827]">
                    Posted
                  </TableHead>
                  <TableHead className="font-semibold text-[#111827] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={article.title}>
                        {article.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#052461]/10 text-[#052461]">
                        {article.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {article.author}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[article.status]}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {isClient
                        ? formatDistanceToNow(new Date(article.publishedAt), {
                            addSuffix: true,
                          })
                        : null}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                          className="border-[#052461]/20 text-[#052461] hover:bg-[#052461]/10"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        {user?.role === "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="border-[#b51c1c]/20 text-[#b51c1c] hover:bg-[#b51c1c]/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                filterCategory !== "all" ||
                filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first article"}
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-[#b51c1c] hover:bg-[#b51c1c]/90 text-white"
              >
                Add New Article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddEditNewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSave}
        article={editingArticle}
      />
    </div>
  );
}

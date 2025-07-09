"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const statuses = ["Published", "Draft", "Scheduled"];

export function AddEditNewsModal({ isOpen, onClose, article }) {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    status: "",
    publishDate: "",
    content: "",
    isSidebar: false,
    isBreaking: false,
    isFeatured: false,
  });

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

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        category: article.category || "",
        author: article.author || "",
        status: article.status || "",
        publishDate: article.publishDate?.slice(0, 10) || "",
        content: article.content || "",
        isSidebar: article.isSidebar || false,
        isBreaking: article.isBreaking || false,
        isFeatured: article.isFeatured || false,
      });
    } else {
      setFormData({
        title: "",
        category: "",
        author: "",
        status: "",
        publishDate: "",
        content: "",
        isSidebar: false,
        isBreaking: false,
        isFeatured: false,
      });
      setImages([]);
      setPreviews([]);
    }
  }, [article]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combined = [...images, ...newFiles];
    if (combined.length > 3) {
      toast.warning("You can only upload up to 3 images.");
      return;
    }
    setImages(combined);
    setPreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const getFormData = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, value.toString())
    );
    images.forEach((img) => data.append("images", img));
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImageUrls = [];

    try {
      // 1. Upload each image to Cloudinary
      for (const imageFile of images) {
        const imageForm = new FormData(); // ✅ Rename this to avoid shadowing
        imageForm.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageForm,
        });

        const uploadData = await uploadRes.json();
        console.log(uploadData);
        if (uploadData.success) {
          uploadedImageUrls.push(uploadData.url);
        } else {
          toast.error("Image upload failed");
          return;
        }
      }

      // 2. Prepare final payload from React state formData
      const payload = {
        ...formData, // ✅ This is your React state
        images: JSON.stringify(uploadedImageUrls),
      };

      const res = await fetch("/api/news/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save article");

      toast.success("News article created.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create news article.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = getFormData();
      await fetch(`/api/news/update/${article.id}`, {
        method: "PUT",
        body: data,
      });

      toast.success("Article updated.");
      onClose();
    } catch (err) {
      toast.error("Update failed.", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] md:w-full bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#111827]">
            {article ? "Edit Article" : "Add New Article"}
          </DialogTitle>
          <DialogDescription>
            {article
              ? "Update the article details below."
              : "Fill in the details to create a new article."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4 md:p-6">
          <form
            onSubmit={article ? handleUpdate : handleSubmit}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Author</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleInputChange("category", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Publish Date</Label>
                <Input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) =>
                    handleInputChange("publishDate", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Upload Images (Max 3)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {previews.length > 0 && (
                  <div className="mt-3 flex gap-3 flex-wrap">
                    {previews.map((src, idx) => (
                      <Image
                        key={idx}
                        src={src}
                        className="w-20 h-20 object-cover rounded border"
                        alt="Preview"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isSidebar}
                  onChange={(e) =>
                    handleInputChange("isSidebar", e.target.checked)
                  }
                />
                Show in Sidebar
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    handleInputChange("isFeatured", e.target.checked)
                  }
                />
                Featured
              </Label>
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isBreaking}
                  onChange={(e) =>
                    handleInputChange("isBreaking", e.target.checked)
                  }
                />
                Breaking News
              </Label>
            </div>

            <div>
              <Label>Content</Label>
              <Textarea
                rows={8}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-[#b51c1c] text-white hover:bg-[#b51c1c]/90"
              >
                {article ? "Update Article" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

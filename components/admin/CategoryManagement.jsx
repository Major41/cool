"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import API from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export function CategoryManagement() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories/all");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    if (user?.role !== "admin") {
      toast.error("Only admins can add categories");
      return;
    }
    setFormData({ name: "", description: "" });
    setIsAddModalOpen(true);
  };

  const openEditModal = (category) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can edit categories");
      return;
    }
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (category) => {
    if (user?.role !== "admin") {
      toast.error("Only admins can delete categories");
      return;
    }
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/categories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Category added successfully");
        setIsAddModalOpen(false);
        fetchCategories();
        setFormData({ name: "", description: "" });
      } else {
        toast.error(result.error || "Failed to add category");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    // if (!formData.name.trim()) {
    //   toast.error("Category name is required");
    //   return;
    // }

    // try {
    //   const res = await API.put(
    //     `/api/categories/update/${selectedCategory.id}`,
    //     {
    //       name: formData.name.trim(),
    //       description: formData.description.trim(),
    //     }
    //   );
    //   toast.success("Category updated");
    //   setIsEditModalOpen(false);
    //   fetchCategories();
    // } catch (err) {
    //   console.error("Edit category error:", err);
    //   toast.error("Failed to update category");
    // }
  };

  const handleDelete = async () => {
    // try {
    //   await API.delete(`/api/categories/delete/${selectedCategory.id}`);
    //   toast.success("Category deleted");
    //   setIsDeleteDialogOpen(false);
    //   fetchCategories();
    // } catch (err) {
    //   console.error("Delete category error:", err);
    //   toast.error("Failed to delete category");
    // }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">
            Category Management
          </h3>
          <p className="text-sm text-gray-600">Manage your news categories</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-[#b51c1c] hover:bg-[#b51c1c]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">Articles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-gray-50">
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {cat.description}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs bg-[#052461]/10 text-[#052461]">
                      {cat.articleCount} articles
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#052461]/20 text-[#052461] hover:bg-[#052461]/10"
                        onClick={() => openEditModal(cat)}
                      >
                        <Edit className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => openDeleteDialog(cat)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="ml-1 hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for your news articles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-[#b51c1c] hover:bg-red-800 cursor-pointer text-white"
            >
              {loading ? "adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} className="bg-[#b51c1c] text-white">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete category &quot;{selectedCategory?.name}
              &quot;? This action cannot be undone and may affect{" "}
              {selectedCategory?.articleCount} articles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

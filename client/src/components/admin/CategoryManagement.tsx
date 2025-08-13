import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Category, InsertCategory, CategoryImage } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ImageData } from "@/lib/imgbb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Eye } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface ExtendedCategory extends Category {
  images?: CategoryImage[];
}

interface CategoryFormData extends Omit<InsertCategory, 'id'> {
  images?: ImageData[];
}

interface CategoryManagementProps {
  getAuthHeaders: () => Record<string, string>;
}

const CategoryManagement = ({ getAuthHeaders }: CategoryManagementProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Queries
  const { data: categories = [], isLoading } = useQuery<ExtendedCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Mutations
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: CategoryFormData) => {
      // First create the category
      const { images, ...rest } = categoryData;
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      
      if (!response.ok) throw new Error('Failed to add category');
      const category = await response.json();

      // Then add images if any
      if (images && images.length > 0) {
        const imagePromises = images.map((image, index) => 
          fetch(`/api/admin/categories/${category.id}/images`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category_id: category.id,
              image_url: image.image_url,
              display_url: image.display_url,
              thumb_url: image.thumb_url,
              delete_url: image.delete_url,
              is_primary: index === 0,
              alt_text: `${category.name} image ${index + 1}`,
              sort_order: index,
            }),
          })
        );

        await Promise.all(imagePromises);
      }

      return category;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryFormData> }) => {
      const { images, ...rest } = data;
      
      // Update category data
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      
      if (!response.ok) throw new Error('Failed to update category');
      const category = await response.json();

      // Update images if provided
      if (images) {
        // Delete existing images
        const existingImages = await fetch(`/api/admin/categories/${id}/images`, {
          headers: getAuthHeaders(),
        }).then(res => res.json());

        await Promise.all(
          existingImages.map((img: CategoryImage) =>
            fetch(`/api/admin/categories/images/${img.id}`, {
              method: "DELETE",
              headers: getAuthHeaders(),
            })
          )
        );

        // Add new images
        const imagePromises = images.map((image, index) =>
          fetch(`/api/admin/categories/${id}/images`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category_id: id,
              image_url: image.image_url,
              display_url: image.display_url,
              thumb_url: image.thumb_url,
              delete_url: image.delete_url,
              is_primary: index === 0,
              alt_text: `${category.name} image ${index + 1}`,
              sort_order: index,
            }),
          })
        );

        await Promise.all(imagePromises);
      }

      return category;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleEdit = (category: ExtendedCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleView = (category: ExtendedCategory) => {
    setSelectedCategory(category);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={(data) => addCategoryMutation.mutate(data)}
              isLoading={addCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Slug: {category.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(category)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
                {category.images && category.images.length > 0 && (
                  <div className="mt-4">
                    <img
                      src={category.images[0].display_url || category.images[0].image_url}
                      alt={category.images[0].alt_text || category.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              initialData={selectedCategory}
              onSubmit={(data) =>
                updateCategoryMutation.mutate({
                  id: selectedCategory.id,
                  data
                })
              }
              isLoading={updateCategoryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryDetails category={selectedCategory} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CategoryFormProps {
  initialData?: ExtendedCategory;
  onSubmit: (data: CategoryFormData) => void;
  isLoading: boolean;
}

const CategoryForm = ({ initialData, onSubmit, isLoading }: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    href: initialData?.href || "",
    title: initialData?.title || "",
    parent_category: initialData?.parent_category || "root",
  });

  const generateSlugAndHref = (name: string) => {
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return {
      slug,
      href: `/categories/${slug}`,
      title: name
    };
  };

  const handleNameChange = (name: string) => {
    const { slug, href, title } = generateSlugAndHref(name);
    setFormData(prev => ({
      ...prev,
      name,
      slug,
      href,
      title
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImagesChange = (images: ImageData[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>


      <div>
        <Label htmlFor="parent_category">Parent Category</Label>
        <Input
          id="parent_category"
          value={formData.parent_category || "root"}
          onChange={(e) => setFormData({ ...formData, parent_category: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Category Images</Label>
        <ImageUpload
          onImagesChange={handleImagesChange}
          maxImages={1}
          existingImages={initialData?.images?.map(img => ({
            image_url: img.image_url,
            display_url: img.display_url,
            thumb_url: img.thumb_url,
            delete_url: img.delete_url,
            is_primary: img.is_primary ?? false,
            alt_text: img.alt_text ?? undefined,
            sort_order: img.sort_order ?? undefined,
          }))}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initialData ? "Update Category" : "Add Category"}
      </Button>
    </form>
  );
};

const CategoryDetails = ({ category }: { category: ExtendedCategory }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{category.name}</h3>
        <p className="text-sm text-muted-foreground">Slug: {category.slug}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>

      {category.images && category.images.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Images</h4>
          <div className="grid grid-cols-2 gap-4">
            {category.images.map((image, index) => (
              <div key={image.id} className="relative">
                <img
                  src={image.display_url || image.image_url}
                  alt={image.alt_text || `Category image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {image.is_primary && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>URL Path:</strong> {category.href}
        </div>
        <div>
          <strong>Title:</strong> {category.title}
        </div>
        <div>
          <strong>Parent Category:</strong> {category.parent_category}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
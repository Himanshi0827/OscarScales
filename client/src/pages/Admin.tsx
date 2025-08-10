import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, InsertProduct, Category } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ProductForm from "@/components/admin/ProductForm";
import ProductDetails from "@/components/admin/ProductDetails";

interface ExtendedProduct extends Product {
  image?: string;
  category?: string;
  images?: string[];
}

interface ProductFormData extends Omit<InsertProduct, 'category_id'> {
  image?: string;
  category?: string;
  imageFiles?: File[];
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, Eye, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/data";

const Admin = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, authLoading, setLocation]);

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return null;
  }

  // Helper functions
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  return (
    <>
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
              <p className="text-lg">Manage products and categories</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user?.username}</span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white text-primary hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManagement getAuthHeaders={getAuthHeaders} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement getAuthHeaders={getAuthHeaders} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

// Products Management Component
const ProductsManagement = ({ getAuthHeaders }: { getAuthHeaders: () => Record<string, string> }) => {
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // Queries
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Create category mapping from fetched categories
  const categoryMap = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {});

  // Mutations
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      const { category, imageFiles, ...rest } = productData;
      const dbData: InsertProduct = {
        ...rest,
        category_id: category ? categoryMap[category] : null,
      };

      // First create the product
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dbData),
      });

      if (!response.ok) throw new Error('Failed to add product');
      const product = await response.json();

      // Then upload images if any
      if (imageFiles?.length) {
        const formData = new FormData();
        imageFiles.forEach((file, index) => {
          formData.append('images', file);
          formData.append('is_primary', index === 0 ? 'true' : 'false');
        });

        const uploadResponse = await fetch(`/api/admin/products/${product.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeaders().Authorization,
          },
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload images');
      }

      return product;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ProductFormData> }) => {
      const { category, imageFiles, ...rest } = data;
      const dbData: Partial<Product> = {
        ...rest,
        category_id: category ? categoryMap[category] : undefined,
      };

      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(dbData),
      });

      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleEdit = (product: Product) => {
    const category = categories.find(cat => cat.id === product.category_id);
    const extendedProduct: ExtendedProduct = {
      ...product,
      category: category?.slug,
      images: [] // Will be fetched by ProductImageManager
    };
    setSelectedProduct(extendedProduct);
    setIsEditModalOpen(true);
  };

  const handleView = (product: Product) => {
    const category = categories.find(cat => cat.id === product.category_id);
    const extendedProduct: ExtendedProduct = {
      ...product,
      category: category?.name || 'Uncategorized',
      images: [] // Will be fetched by ProductDetails
    };
    setSelectedProduct(extendedProduct);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSubmit={(data) => addProductMutation.mutate(data)}
              isLoading={addProductMutation.isPending}
              categories={categories}
              getAuthHeaders={getAuthHeaders}
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
          {products.map((product) => {
            const category = categories.find(cat => cat.id === product.category_id);
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Category: {category?.name || 'Uncategorized'} | Price: {formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {product.featured && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {product.bestseller && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Bestseller
                      </span>
                    )}
                    {product.new_arrival && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        New Arrival
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              initialData={selectedProduct}
              onSubmit={(data) =>
                updateProductMutation.mutate({
                  id: selectedProduct.id,
                  data
                })
              }
              isLoading={updateProductMutation.isPending}
              categories={categories}
              getAuthHeaders={getAuthHeaders}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <ProductDetails 
              product={selectedProduct}
              getAuthHeaders={getAuthHeaders}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
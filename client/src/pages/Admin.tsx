import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, InsertProduct, Category } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface ExtendedProduct extends Product {
  image?: string;
  category?: string;
}

interface ProductFormData extends Omit<InsertProduct, 'category_id'> {
  image?: string;
  category?: string;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  
  // State hooks
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

  // Queries
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
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
      const { category, image, ...rest } = productData;
      const dbData: InsertProduct = {
        ...rest,
        category_id: category ? categoryMap[category] : null,
      };
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dbData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      return response.json();
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
      const { category, image, ...rest } = data;
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
      category: category?.name || 'Uncategorized',
      image: 'https://via.placeholder.com/400x300' // Replace with actual image URL
    };
    setSelectedProduct(extendedProduct);
    setIsEditModalOpen(true);
  };

  const handleView = (product: Product) => {
    const category = categories.find(cat => cat.id === product.category_id);
    const extendedProduct: ExtendedProduct = {
      ...product,
      category: category?.name || 'Uncategorized',
      image: 'https://via.placeholder.com/400x300' // Replace with actual image URL
    };
    setSelectedProduct(extendedProduct);
    setIsViewModalOpen(true);
  };

  return (
    <>
      
      <div className="bg-gradient-primary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
              <p className="text-lg">Manage products and inventory</p>
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
        <div className="mb-6 flex justify-between items-center">
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
              // Convert database product to extended product for UI
              const category = categories.find(cat => cat.id === product.category_id);
              const extendedProduct: ExtendedProduct = {
                ...product,
                category: category?.name || 'Uncategorized',
                image: 'https://via.placeholder.com/400x300' // Replace with actual image URL
              };
              return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Category: {extendedProduct.category} | Price: {formatPrice(product.price)}
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
              <ProductDetails product={selectedProduct} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

interface ProductFormProps {
  initialData?: ExtendedProduct;
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  categories: Category[];
}

const ProductForm = ({ initialData, onSubmit, isLoading, categories }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image: initialData?.image || "",
    category: initialData?.category || "",
    featured: initialData?.featured || false,
    bestseller: initialData?.bestseller || false,
    new_arrival: initialData?.new_arrival || false,
    accuracy: initialData?.accuracy || "",
    power_supply: initialData?.power_supply || "",
    display: initialData?.display || "",
    material: initialData?.material || "",
    warranty: initialData?.warranty || "",
    certification: initialData?.certification || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accuracy">Accuracy</Label>
          <Input
            id="accuracy"
            value={formData.accuracy || ""}
            onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="power_supply">Power Supply</Label>
          <Input
            id="power_supply"
            value={formData.power_supply || ""}
            onChange={(e) => setFormData({ ...formData, power_supply: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="display">Display</Label>
          <Input
            id="display"
            value={formData.display || ""}
            onChange={(e) => setFormData({ ...formData, display: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={formData.material || ""}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="warranty">Warranty</Label>
          <Input
            id="warranty"
            value={formData.warranty || ""}
            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="certification">Certification</Label>
          <Input
            id="certification"
            value={formData.certification || ""}
            onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={formData.featured || false}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bestseller"
            checked={formData.bestseller || false}
            onCheckedChange={(checked) => setFormData({ ...formData, bestseller: !!checked })}
          />
          <Label htmlFor="bestseller">Bestseller</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="new_arrival"
            checked={formData.new_arrival || false}
            onCheckedChange={(checked) => setFormData({ ...formData, new_arrival: !!checked })}
          />
          <Label htmlFor="new_arrival">New Arrival</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
      </Button>
    </form>
  );
};

const ProductDetails = ({ product }: { product: ExtendedProduct }) => {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div>
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-lg text-primary font-semibold">{formatPrice(product.price)}</p>
        <p className="text-sm text-muted-foreground">Category: {product.category}</p>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Accuracy:</strong> {product.accuracy || "N/A"}
        </div>
        <div>
          <strong>Power Supply:</strong> {product.power_supply || "N/A"}
        </div>
        <div>
          <strong>Display:</strong> {product.display || "N/A"}
        </div>
        <div>
          <strong>Material:</strong> {product.material || "N/A"}
        </div>
        <div>
          <strong>Warranty:</strong> {product.warranty || "N/A"}
        </div>
        <div>
          <strong>Certification:</strong> {product.certification || "N/A"}
        </div>
      </div>

      <div className="flex gap-2">
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
    </div>
  );
};

export default Admin;
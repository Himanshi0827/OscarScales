import { useState } from "react";
import { Category, InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "./ImageUpload";
import ProductImageManager from "./ProductImageManager";

interface ExtendedProduct extends InsertProduct {
  id?: number;
  image?: string;
  category?: string;
  images?: string[];
}

interface ProductFormData extends Omit<InsertProduct, 'category_id'> {
  image?: string;
  category?: string;
  imageFiles?: File[];
}

interface ProductFormProps {
  initialData?: ExtendedProduct;
  onSubmit: (data: ProductFormData) => void;
  isLoading: boolean;
  categories: Category[];
  getAuthHeaders: () => Record<string, string>;
}

const ProductForm = ({ initialData, onSubmit, isLoading, categories, getAuthHeaders }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
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

  const handleImagesChange = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: files
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div>
        {initialData?.id ? (
          <ProductImageManager
            productId={initialData.id}
            getAuthHeaders={getAuthHeaders}
          />
        ) : (
          <div>
            <Label>Product Images</Label>
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>
        )}
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

export default ProductForm;
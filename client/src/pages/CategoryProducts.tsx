import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/products/ProductModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getCategoryName = (slug: string) => {
  const categories: Record<string, string> = {
    personal: "Personal Scales",
    jewelry: "Jewelry Scales",
    industrial: "Industrial Scales",
    dairy: "Dairy Scales",
    kitchen: "Kitchen Scales",
  };
  
  return categories[slug] || "Products";
};

const getCategoryDescription = (slug: string) => {
  const descriptions: Record<string, string> = {
    personal: "Accurate and stylish scales for monitoring body weight and composition.",
    jewelry: "High-precision scales for measuring precious metals and gemstones.",
    industrial: "Heavy-duty weighing solutions for warehouses, factories, and logistics operations.",
    dairy: "Specialized scales for milk collection and dairy product measurement.",
    kitchen: "Compact and precise scales for cooking, baking, and food preparation.",
  };
  
  return descriptions[slug] || "Explore our range of quality weighing solutions.";
};

const CategoryProducts = () => {
  const params = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const categoryName = getCategoryName(params.category);
  const categoryDescription = getCategoryDescription(params.category);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${params.category}`],
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "bestseller":
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      case "new":
        return (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0);
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <>
      <Helmet>
        <title>{categoryName} - Oscar Digital System</title>
        <meta name="description" content={categoryDescription} />
      </Helmet>
      
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryName}</h1>
          <p className="text-lg max-w-3xl">
            {categoryDescription}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-end">
          <div className="w-full max-w-xs">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="bestseller">Bestsellers</SelectItem>
                <SelectItem value="new">New Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => handleProductClick(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-neutral-dark">
              We couldn't find any products in this category.
            </p>
          </div>
        )}
      </div>
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default CategoryProducts;

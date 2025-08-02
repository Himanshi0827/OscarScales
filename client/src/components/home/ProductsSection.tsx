import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/products/ProductModal";
import { Product, Category } from "@shared/schema";
import { cn } from "@/lib/utils";

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(product => product.category_id === activeCategory);

  const displayedProducts = filteredProducts.slice(0, 8); // Limit to 8 for homepage

  const handleCategoryChange = (categoryId: number | "all") => {
    setActiveCategory(categoryId);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section id="products" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Featured Products</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Browse through our wide selection of weighing scales designed for various applications.
          </p>
        </div>
        
        {/* Category filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            key="all"
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105",
              "shadow-sm hover:shadow-md",
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-white border border-neutral-200 hover:border-primary hover:text-primary"
            )}
            onClick={() => handleCategoryChange("all")}
          >
            All Products
          </button>
          {categoriesLoading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-24 h-10 bg-neutral-100 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all transform hover:scale-105",
                  "shadow-sm hover:shadow-md",
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-white border border-neutral-200 hover:border-primary hover:text-primary"
                )}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))
          )}
        </div>
        
        {/* Products grid */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
            {displayedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 transform transition-transform hover:scale-105 shadow-lg"
          >
            <Link href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4 animate-bounceRight" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          product={selectedProduct} 
        />
      )}
    </section>
  );
};

export default ProductsSection;

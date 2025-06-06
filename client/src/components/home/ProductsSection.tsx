import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import ProductModal from "@/components/products/ProductModal";
import { Product } from "@shared/schema";

const categories = [
  { name: "All Products", value: "all" },
  { name: "Personal", value: "personal" },
  { name: "Jewelry", value: "jewelry" },
  { name: "Industrial", value: "industrial" },
  { name: "Dairy", value: "dairy" },
  { name: "Kitchen", value: "kitchen" },
];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(product => product.category === activeCategory);

  const displayedProducts = filteredProducts.slice(0, 8); // Limit to 8 for homepage

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
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
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.value
                  ? "bg-primary text-white"
                  : "bg-neutral hover:bg-primary hover:text-white"
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onViewDetails={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
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

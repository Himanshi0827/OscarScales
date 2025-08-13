import { Link } from "wouter";
import { Product, Category, ProductImage as ProductImageType } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Component to handle product image display
const ProductImage = ({ productId }: { productId: number }) => {
  const { data: images = [] } = useQuery<ProductImageType[]>({
    queryKey: [`/api/products/${productId}/images`],
  });

  const primaryImage = images.find(img => img.is_primary) || images[0];
  
  return (
    <img
      src={primaryImage?.display_url || 'https://via.placeholder.com/400x300?text=No+Image'}
      alt="Product image"
      className="w-full h-56 object-cover transition-transform group-hover:scale-105"
    />
  );
};
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

interface ExtendedProduct extends Product {
  image?: string;
  category?: string;
}

type ProductCardProps = {
  product: ExtendedProduct;
  onViewDetails: () => void;
};

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  // Mock rating for display purposes - in a real app this would come from a database
  const getRandomRating = () => {
    const ratings = [4, 4.5, 5];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };
  
  const getRandomReviewCount = () => {
    return Math.floor(Math.random() * 150) + 20;
  };
  
  const rating = getRandomRating();
  const reviewCount = getRandomReviewCount();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    return stars;
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="product-card group bg-white rounded-lg shadow-md overflow-hidden relative product-card-hover">
      <div className="relative overflow-hidden">
        <ProductImage productId={product.id} />
        {product.bestseller && (
          <div className="absolute top-3 left-3">
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              Bestseller
            </span>
          </div>
        )}
        {product.new_arrival && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="product-title text-lg font-semibold mb-1">{product.name}</h3>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {renderStars(rating)}
          </div>
          <span className="text-xs text-neutral-dark ml-1">({reviewCount})</span>
        </div>
        <p className="text-sm text-neutral-dark mb-3">
          {product.description.length > 60 
            ? `${product.description.substring(0, 60)}...` 
            : product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="product-price text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white relative z-20"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            View Details
          </Button>
        </div>
      </div>
      
      {/* Quick contact options (visible on hover) */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0f172a]/90 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform z-10">
        <div className="flex justify-between gap-2">
          <a
            href="https://wa.me/919876543210"
            className="flex-1 flex items-center justify-center bg-green-500 text-white py-1 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <FaWhatsapp className="mr-1" /> WhatsApp
          </a>
          <a
            href="tel:+919876543210"
            className="flex-1 flex items-center justify-center bg-primary text-white py-1 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

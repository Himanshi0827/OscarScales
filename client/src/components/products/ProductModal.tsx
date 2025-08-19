import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product, ProductImage } from "@shared/schema";
import { Star, StarHalf, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const ProductImages = ({ productId }: { productId: number }) => {
  const { data: images = [] } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${productId}/images`],
  });

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const primaryImage = images.find(img => img.is_primary);
      setSelectedImage(primaryImage || images[0]);
      setSelectedIndex(primaryImage ? images.indexOf(primaryImage) : 0);
    }
  }, [images]);

  const handlePrevImage = () => {
    if (images.length > 0) {
      const newIndex = (selectedIndex - 1 + images.length) % images.length;
      setSelectedIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (images.length > 0) {
      const newIndex = (selectedIndex + 1) % images.length;
      setSelectedIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  if (!selectedImage) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={selectedImage.display_url || selectedImage.image_url}
        alt={selectedImage.alt_text || "Product image"}
        className="w-full h-[400px] object-cover rounded-lg"
      />
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </>
      )}

      {/* Thumbnail navigation */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.thumb_url || image.image_url}
            alt={image.alt_text || `Product image ${index + 1}`}
            className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition-colors ${
              selectedImage.id === image.id ? 'border-primary' : 'border-transparent hover:border-primary/50'
            }`}
            onClick={() => {
              setSelectedImage(image);
              setSelectedIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

type ProductModalProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  // Mock rating for display purposes
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
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-dark hover:text-dark"
          >
            <X size={24} />
          </button>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <ProductImages productId={product.id} />
          
          <div>
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-neutral-dark ml-2">({reviewCount} reviews)</span>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
              <span className="text-sm text-neutral-dark ml-2">Including GST</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-neutral-dark">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm"><span className="font-medium">Accuracy:</span> {product.accuracy || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Power Supply:</span> {product.power_supply || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Display:</span> {product.display || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Material:</span> {product.material || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Warranty:</span> {product.warranty || 'N/A'}</div>
                <div className="text-sm"><span className="font-medium">Certification:</span> {product.certification || 'N/A'}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a 
                  href="https://wa.me/919876543210" 
                  className="flex items-center justify-center bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="mr-2" size={18} /> WhatsApp
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center justify-center bg-primary text-white py-3 rounded hover:bg-primary/90 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Call Now
                </a>
                <a 
                  href="mailto:oscardigicompany@gmail.com"
                  className="flex items-center justify-center bg-secondary text-white py-3 rounded hover:bg-secondary/90 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

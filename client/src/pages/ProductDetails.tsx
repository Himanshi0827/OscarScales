import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Product, ProductImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, ArrowLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const ProductDetails = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const productId = parseInt(params.id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, isError } = useQuery<Product & { images: ProductImage[] }>({
    queryKey: [`/api/products/${productId}`],
  });

  useEffect(() => {
    if (product?.images) {
      const primaryIndex = product.images.findIndex(img => img.is_primary);
      setSelectedImageIndex(primaryIndex !== -1 ? primaryIndex : 0);
    }
  }, [product?.images]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

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
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={20} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={20} />);
    }

    return stars;
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Oscar Digital System</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => setLocation("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImageIndex].display_url}
                    alt={product.images[selectedImageIndex].alt_text || product.name}
                    className="w-full h-[400px] object-cover rounded-md"
                  />
                  
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {product.images.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.thumb_url || image.display_url}
                        alt={image.alt_text || `${product.name} image ${index + 1}`}
                        className={`w-full h-20 object-cover rounded border-2 cursor-pointer transition-colors ${
                          selectedImageIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {product.bestseller && (
                <span className="inline-block bg-secondary text-white text-xs px-3 py-1 rounded-full mb-2">
                  Bestseller
                </span>
              )}
              {product.new_arrival && (
                <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full mb-2 ml-2">
                  New Arrival
                </span>
              )}
              
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-neutral-dark ml-2">
                  {reviewCount} reviews
                </span>
              </div>
              
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-neutral-dark ml-2">
                  Including GST
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-neutral-dark leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  <div className="text-sm"><span className="font-medium">Accuracy:</span> {product.accuracy || 'N/A'}</div>
                  <div className="text-sm"><span className="font-medium">Power Supply:</span> {product.power_supply || 'N/A'}</div>
                  <div className="text-sm"><span className="font-medium">Display:</span> {product.display || 'N/A'}</div>
                  <div className="text-sm"><span className="font-medium">Material:</span> {product.material || 'N/A'}</div>
                  <div className="text-sm"><span className="font-medium">Warranty:</span> {product.warranty || 'N/A'}</div>
                  <div className="text-sm"><span className="font-medium">Certification:</span> {product.certification || 'N/A'}</div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-3">Interested in this product?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a 
                    href="https://wa.me/919876543210?text=I'm%20interested%20in%20your%20product:%20${product.name}" 
                    className="flex items-center justify-center bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="mr-2" size={20} /> WhatsApp
                  </a>
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-center justify-center bg-primary text-white py-3 rounded hover:bg-primary/90 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Call Now
                  </a>
                  <a 
                    href="mailto:info@oscardigital.com?subject=Inquiry about ${product.name}" 
                    className="flex items-center justify-center bg-secondary text-white py-3 rounded hover:bg-secondary/90 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

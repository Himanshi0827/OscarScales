import { useQuery } from "@tanstack/react-query";
import { Product, ProductImage } from "@shared/schema";
import { formatPrice } from "@/lib/data";

interface ExtendedProduct extends Product {
  image?: string;
  category?: string;
  images?: string[];
}

interface ProductDetailsProps {
  product: ExtendedProduct;
  getAuthHeaders: () => Record<string, string>;
}

const ProductDetails = ({ product, getAuthHeaders }: ProductDetailsProps) => {
  // Fetch product images
  const { data: productImages = [] } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${product.id}/images`],
    enabled: !!product.id,
  });

  return (
    <div className="space-y-4">
      {productImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {productImages.map((image, index) => (
            <div key={image.id} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image.image_url}
                alt={image.alt_text || `${product.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
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

export default ProductDetails;
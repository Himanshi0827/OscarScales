import { useState, useEffect } from "react";
import { ProductImage } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { ImageData, deleteFromImgBB } from "@/lib/imgbb";

interface ProductImageManagerProps {
  productId: number;
  getAuthHeaders: () => Record<string, string>;
}

const ProductImageManager = ({ productId, getAuthHeaders }: ProductImageManagerProps) => {
  const { toast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);

  // Fetch product images
  const { data: productImages = [], isLoading } = useQuery<ProductImage[]>({
    queryKey: [`/api/products/${productId}/images`],
    enabled: !!productId,
  });

  useEffect(() => {
    if (productImages) {
      setImages(productImages);
    }
  }, [productImages]);

  // Mutations
  const deleteImageMutation = useMutation({
    mutationFn: async (image: ProductImage) => {
      // First delete from ImgBB if delete_url is available
      if (image.delete_url) {
        const imgbbDeleted = await deleteFromImgBB(image.delete_url);
        if (!imgbbDeleted) {
          throw new Error('Failed to delete image from ImgBB');
        }
      }

      // Then delete from our database
      const response = await fetch(`/api/admin/products/images/${image.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete image from database');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/images`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ imageId, data }: { imageId: number; data: Partial<ProductImage> }) => {
      const response = await fetch(`/api/admin/products/images/${imageId}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update image');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/images`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update image order",
        variant: "destructive",
      });
    },
  });

  const handleImagesChange = (newImages: ImageData[]) => {
    // Create product images from ImgBB data
    const createImages = async () => {
      for (const image of newImages) {
        try {
          const response = await fetch(`/api/admin/products/${productId}/images`, {
            method: 'POST',
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image_url: image.image_url,
              display_url: image.display_url,
              thumb_url: image.thumb_url,
              delete_url: image.delete_url,
              is_primary: image.is_primary,
              alt_text: image.alt_text,
              sort_order: image.sort_order || images.length,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to create product image');
          }
        } catch (error) {
          console.error('Failed to create product image:', error);
          toast({
            title: "Error",
            description: "Failed to save image",
            variant: "destructive",
          });
        }
      }

      // Refresh images
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/images`] });
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    };

    createImages();
  };

  const handleDelete = (image: ProductImage) => {
    if (confirm("Are you sure you want to delete this image?")) {
      deleteImageMutation.mutate(image);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newImages = [...images];
    const currentImage = newImages[index];
    const prevImage = newImages[index - 1];
    
    // Swap sort orders
    updateImageMutation.mutate({
      imageId: currentImage.id,
      data: { sort_order: prevImage.sort_order }
    });
    updateImageMutation.mutate({
      imageId: prevImage.id,
      data: { sort_order: currentImage.sort_order }
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= images.length - 1) return;
    const newImages = [...images];
    const currentImage = newImages[index];
    const nextImage = newImages[index + 1];
    
    // Swap sort orders
    updateImageMutation.mutate({
      imageId: currentImage.id,
      data: { sort_order: nextImage.sort_order }
    });
    updateImageMutation.mutate({
      imageId: nextImage.id,
      data: { sort_order: currentImage.sort_order }
    });
  };

  const handleSetPrimary = (imageId: number) => {
    // Set all images as non-primary
    images.forEach(img => {
      if (img.is_primary) {
        updateImageMutation.mutate({
          imageId: img.id,
          data: { is_primary: false }
        });
      }
    });

    // Set selected image as primary
    updateImageMutation.mutate({
      imageId: imageId,
      data: { is_primary: true }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Images</h3>
        <ImageUpload
          onImagesChange={handleImagesChange}
          maxImages={5}
          existingImages={images.map(img => ({
            image_url: img.image_url,
            display_url: img.display_url,
            thumb_url: img.thumb_url,
            delete_url: img.delete_url,
            is_primary: img.is_primary ?? false,
            alt_text: img.alt_text ?? undefined,
            sort_order: img.sort_order ?? undefined,
          }))}
          onExistingImageRemove={(index) => handleDelete(images[index])}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group border rounded-lg overflow-hidden">
            <img
              src={image.display_url || image.image_url}
              alt={image.alt_text || `Product image ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetPrimary(image.id)}
                disabled={image.is_primary ?? false}
              >
                {image.is_primary ? "Primary" : "Set as Primary"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMoveDown(index)}
                disabled={index === images.length - 1}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(image)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {image.is_primary && (
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageManager;
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2 } from "lucide-react";
import { uploadToImgBB, type ImageData } from "@/lib/imgbb";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImagesChange: (images: ImageData[]) => void;
  maxImages?: number;
  existingImages?: ImageData[];
  onExistingImageRemove?: (index: number) => void;
}

const ImageUpload = ({
  onImagesChange,
  maxImages = 5,
  existingImages = [],
  onExistingImageRemove,
}: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = existingImages.length + selectedImages.length + files.length;

    if (totalImages > maxImages) {
      toast({
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload each file to ImgBB
      const uploadPromises = files.map(async (file, index) => {
        const imageData = await uploadToImgBB(file, `image-${Date.now()}-${index}`);
        return {
          ...imageData,
          is_primary: index === 0 && selectedImages.length === 0 && existingImages.length === 0,
          sort_order: selectedImages.length + index,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Update selected images
      const newSelectedImages = [...selectedImages, ...uploadedImages];
      setSelectedImages(newSelectedImages);
      onImagesChange(newSelectedImages);

      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      onImagesChange(newImages);
      return newImages;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <Label
          htmlFor="image-upload"
          className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading ? 'Uploading...' : 'Select Images'}
        </Label>
        <span className="text-sm text-gray-500">
          {maxImages - (existingImages.length + selectedImages.length)} images remaining
        </span>
      </div>

      {/* Display existing images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {existingImages.map((image, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img
                src={image.display_url}
                alt={image.alt_text || `Existing image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              {onExistingImageRemove && (
                <button
                  onClick={() => onExistingImageRemove(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {image.is_primary && (
                <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Display newly uploaded images */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-5 gap-4 mt-4">
          {selectedImages.map((image, index) => (
            <div key={`uploaded-${index}`} className="relative group">
              <img
                src={image.display_url}
                alt={image.alt_text || `Uploaded image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeSelectedImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {image.is_primary && (
                <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
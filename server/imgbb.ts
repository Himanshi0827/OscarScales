import { config } from "dotenv";
config();

import { z } from "zod";

// ImgBB API response types
export const imgbbResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    title: z.string(),
    url_viewer: z.string(),
    url: z.string(),
    display_url: z.string(),
    width: z.union([z.string(), z.number()]),
    height: z.union([z.string(), z.number()]),
    size: z.union([z.string(), z.number()]),
    time: z.union([z.string(), z.number()]),
    expiration: z.union([z.string(), z.number()]),
    image: z.object({
      filename: z.string(),
      name: z.string(),
      mime: z.string(),
      extension: z.string(),
      url: z.string(),
    }),
    thumb: z.object({
      filename: z.string(),
      name: z.string(),
      mime: z.string(),
      extension: z.string(),
      url: z.string(),
    }),
    medium: z.object({
      filename: z.string(),
      name: z.string(),
      mime: z.string(),
      extension: z.string(),
      url: z.string(),
    }),
    delete_url: z.string(),
  }),
  success: z.boolean(),
  status: z.number(),
});

export type ImgBBResponse = z.infer<typeof imgbbResponseSchema>;

export class ImgBBService {
  private apiKey: string;
  private baseUrl = "https://api.imgbb.com/1";

  constructor(apiKey?: string) {
    const key = apiKey || process.env.IMGBB_API_KEY;
    if (!key) {
      throw new Error("IMGBB_API_KEY environment variable is not set");
    }
    this.apiKey = key;
  }

  /**
   * Upload an image to ImgBB
   * @param image Base64 encoded image or image URL
   * @param name Optional name for the image
   * @param expiration Optional expiration time in seconds (60-15552000)
   * @returns ImgBB response with image URLs and deletion URL
   */
  async uploadImage(
    image: string,
    name?: string,
    expiration?: number
  ): Promise<ImgBBResponse> {
    const formData = new FormData();
    formData.append("image", image);
    if (name) formData.append("name", name);
    if (expiration) formData.append("expiration", expiration.toString());

    const url = `${this.baseUrl}/upload?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    return imgbbResponseSchema.parse(data);
  }

  /**
   * Delete an image from ImgBB using its deletion URL
   * @param deleteUrl The deletion URL provided by ImgBB when the image was uploaded
   * @returns true if deletion was successful
   */
  async deleteImage(deleteUrl: string): Promise<boolean> {
    try {
      const response = await fetch(deleteUrl);
      return response.ok;
    } catch (error) {
      console.error("Failed to delete image:", error);
      return false;
    }
  }

  /**
   * Upload a local image file to ImgBB
   * @param file Image file from form upload
   * @param name Optional name for the image
   * @param expiration Optional expiration time in seconds (60-15552000)
   * @returns ImgBB response with image URLs and deletion URL
   */
  async uploadFile(
    file: File,
    name?: string,
    expiration?: number
  ): Promise<ImgBBResponse> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = (reader.result as string).split(",")[1];
          const response = await this.uploadImage(base64Image, name, expiration);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
}

// Create and export a function to get the ImgBB service instance
let instance: ImgBBService | null = null;

export function getImgBBService(apiKey?: string): ImgBBService | null {
  if (!instance) {
    try {
      instance = new ImgBBService(apiKey);
    } catch (error) {
      console.warn('ImgBB service not initialized. Image-related features will be disabled.');
      return null;
    }
  }
  return instance;
}

// Export a function to initialize the service
export function initImgBBService(apiKey?: string): void {
  try {
    instance = new ImgBBService(apiKey);
  } catch (error) {
    console.warn('ImgBB service not initialized. Image-related features will be disabled.');
  }
}
import { z } from "zod";

// ImgBB API response types
export const imgbbResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    title: z.string(),
    url_viewer: z.string(),
    url: z.string(),
    display_url: z.string(),
    width: z.string(),
    height: z.string(),
    size: z.string(),
    time: z.string(),
    expiration: z.string(),
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

export interface ImageData {
  image_url: string;
  display_url: string;
  thumb_url: string;
  delete_url: string;
  is_primary: boolean;
  alt_text?: string;
  sort_order?: number;
}

export async function uploadToImgBB(file: File, name?: string): Promise<ImageData> {
  const formData = new FormData();
  formData.append("image", file);
  if (name) formData.append("name", name);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  const imgbbData = imgbbResponseSchema.parse(data);

  return {
    image_url: imgbbData.data.image.url,
    display_url: imgbbData.data.display_url,
    thumb_url: imgbbData.data.thumb.url,
    delete_url: imgbbData.data.delete_url,
    is_primary: false,
  };
}

export async function deleteFromImgBB(deleteUrl: string): Promise<boolean> {
  const response = await fetch("/api/delete-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deleteUrl }),
  });

  return response.ok;
}
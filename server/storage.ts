import { getImgBBService } from "./imgbb.js";
import { promises as fs } from 'fs';
import path from 'path';
import {
  products,
  type Product,
  type InsertProduct,
  contactMessages,
  type ContactMessage,
  type InsertContactMessage,
  categories,
  type Category,
  type InsertCategory,
  productImages,
  type ProductImage,
  type InsertProductImage,
  categoryImages,
  type CategoryImage,
  type InsertCategoryImage
} from "@shared/schema";
import { db } from "./db.js";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Category Image methods
  getCategoryImages(categoryId: number): Promise<CategoryImage[]>;
  getPrimaryCategoryImage(categoryId: number): Promise<CategoryImage | undefined>;
  createCategoryImage(image: InsertCategoryImage): Promise<CategoryImage>;
  updateCategoryImage(id: number, data: Partial<CategoryImage>): Promise<CategoryImage | undefined>;
  deleteCategoryImage(id: number): Promise<boolean>;

  // Product Image methods
  getProductImages(productId: number): Promise<ProductImage[]>;
  getPrimaryProductImage(productId: number): Promise<ProductImage | undefined>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  updateProductImage(id: number, data: Partial<ProductImage>): Promise<ProductImage | undefined>;
  deleteProductImage(id: number): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByCategorySlug(slug: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestsellerProducts(): Promise<Product[]>;
  getNewArrivalProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Admin methods
  updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private imgbb: ReturnType<typeof getImgBBService> | null = null;

  constructor() {
    try {
      this.imgbb = getImgBBService();
    } catch (error) {
      console.warn('ImgBB service not initialized. Image-related features will be disabled.');
    }
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return result.length > 0;
  }

  // Category Image methods
  async getCategoryImages(categoryId: number): Promise<CategoryImage[]> {
    return await db
      .select()
      .from(categoryImages)
      .where(eq(categoryImages.category_id, categoryId))
      .orderBy(categoryImages.sort_order);
  }

  async getPrimaryCategoryImage(categoryId: number): Promise<CategoryImage | undefined> {
    const images = await db
      .select()
      .from(categoryImages)
      .where(
        and(
          eq(categoryImages.category_id, categoryId),
          eq(categoryImages.is_primary, true)
        )
      );
    return images[0] || undefined;
  }

  async createCategoryImage(insertImage: InsertCategoryImage): Promise<CategoryImage> {
    const [image] = await db
      .insert(categoryImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async updateCategoryImage(id: number, data: Partial<CategoryImage>): Promise<CategoryImage | undefined> {
    const [updatedImage] = await db
      .update(categoryImages)
      .set(data)
      .where(eq(categoryImages.id, id))
      .returning();
    return updatedImage || undefined;
  }

  async deleteCategoryImage(id: number): Promise<boolean> {
    const result = await db
      .delete(categoryImages)
      .where(eq(categoryImages.id, id))
      .returning();
    return result.length > 0;
  }

  // Product Image methods
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return await db
      .select()
      .from(productImages)
      .where(eq(productImages.product_id, productId))
      .orderBy(productImages.sort_order);
  }

  async getPrimaryProductImage(productId: number): Promise<ProductImage | undefined> {
    const images = await db
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.product_id, productId),
          eq(productImages.is_primary, true)
        )
      );
    return images[0] || undefined;
  }

  async getProductsByCategorySlug(slug: string): Promise<Product[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    return this.getProductsByCategory(category.id);
  }

  async createProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    // If this is a primary image, unset primary flag on all other images
    if (insertImage.is_primary) {
      await db
        .update(productImages)
        .set({ is_primary: false })
        .where(eq(productImages.product_id, insertImage.product_id));
    }

    // Get current max sort order for this product
    const existingImages = await this.getProductImages(insertImage.product_id);
    const maxSortOrder = Math.max(...existingImages.map(img => img.sort_order || 0), -1);

    // Set sort order if not provided
    const imageToInsert = {
      ...insertImage,
      sort_order: insertImage.sort_order ?? maxSortOrder + 1
    };

    // Insert the new image
    const [image] = await db
      .insert(productImages)
      .values(imageToInsert)
      .returning();

    return image;
  }

  async updateProductImage(id: number, data: Partial<ProductImage>): Promise<ProductImage | undefined> {
    const [updatedImage] = await db
      .update(productImages)
      .set(data)
      .where(eq(productImages.id, id))
      .returning();
    return updatedImage || undefined;
  }

  async deleteProductImage(id: number): Promise<boolean> {
    const result = await db
      .delete(productImages)
      .where(eq(productImages.id, id))
      .returning();
    return result.length > 0;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category_id, categoryId));
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }
  
  async getBestsellerProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.bestseller, true));
  }
  
  async getNewArrivalProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.new_arrival, true));
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }
  
  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }
  
  // Admin methods
  async updateProduct(id: number, data: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Initialize database tables
  async initializeDatabase() {
    // No initial data loading needed as data will be added through admin interface
    console.log("Database initialization complete. Ready for data entry through admin interface.");
  }
}

export const storage = new DatabaseStorage();

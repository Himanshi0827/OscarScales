import { getImgBBService } from "./imgbb.js";
import { promises as fs } from 'fs';
import path from 'path';
import {
  users,
  type User,
  type InsertUser,
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
import { db } from "./db";
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

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  private imgbb = getImgBBService();

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

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
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
  
  // Initialize database with sample data
  async initializeDatabase() {
    // Check if data already exists
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      return; // Database already initialized
    }

    // Read and insert categories from categories.json
    const categoriesJson = JSON.parse(
      await import('fs/promises').then(fs =>
        fs.readFile(new URL('../data/categories.json', import.meta.url), 'utf8')
      )
    ) as { categories: Array<InsertCategory & { image: string }> };

    // Insert all categories
    const insertedCategories = await db.insert(categories)
      .values(categoriesJson.categories.map(({ image, ...categoryFields }) => categoryFields))
      .returning();

    // Create a map of slugs to category IDs
    const categoryMap = Object.fromEntries(
      insertedCategories.map(cat => [cat.slug, cat.id])
    );

    // Initialize category images
    for (let i = 0; i < insertedCategories.length; i++) {
      const category = insertedCategories[i];
      const categoryJson = categoriesJson.categories[i];
      
      try {
        // Read image file from local filesystem
        const imageBuffer = await fs.readFile(path.join(process.cwd(), 'public', categoryJson.image));
        const base64Image = imageBuffer.toString('base64');

        // Upload to ImgBB
        const imgbbResponse = await this.imgbb.uploadImage(
          base64Image,
          `category-${category.slug}`
        );

        // Store ImgBB URLs in database
        await db.insert(categoryImages).values({
          category_id: category.id,
          image_url: imgbbResponse.data.image.url,
          display_url: imgbbResponse.data.display_url,
          thumb_url: imgbbResponse.data.thumb.url,
          delete_url: imgbbResponse.data.delete_url,
          is_primary: true,
          alt_text: category.name,
          sort_order: 0
        });
        console.log(`Successfully created category: ${category.name}`);
      } catch (error) {
        console.error(`Failed to create category image for ${category.name}:`, error);
        // Continue with next category
      }
    }

    // Read and insert products from products.json
    const productsJson = JSON.parse(
      await import('fs/promises').then(fs =>
        fs.readFile(new URL('../data/products.json', import.meta.url), 'utf8')
      )
    ) as { products: Array<InsertProduct & { images: Array<InsertProductImage & { is_primary: boolean }> }> };

    // Insert all products and their images
    for (const productData of productsJson.products) {
      try {
        // Extract images before inserting product
        const { images, ...productFields } = productData;

        // Insert product
        const [insertedProduct] = await db
          .insert(products)
          .values(productFields)
          .returning();

        if (!insertedProduct?.id) {
          throw new Error("Failed to insert product");
        }

        // Insert all images for this product
        for (const image of images) {
          try {
            // Read image file from local filesystem
            const imageBuffer = await fs.readFile(path.join(process.cwd(), 'public', image.image_url));
            const base64Image = imageBuffer.toString('base64');

            // Upload to ImgBB
            const imgbbResponse = await this.imgbb.uploadImage(
              base64Image,
              `product-${insertedProduct.id}-${image.sort_order}`
            );

            // Store ImgBB URLs in database
            await db
              .insert(productImages)
              .values({
                product_id: insertedProduct.id,
                image_url: imgbbResponse.data.image.url,
                display_url: imgbbResponse.data.display_url,
                thumb_url: imgbbResponse.data.thumb.url,
                delete_url: imgbbResponse.data.delete_url,
                is_primary: image.is_primary,
                alt_text: image.alt_text,
                sort_order: image.sort_order
              });
          } catch (error) {
            console.error(`Failed to upload image for product ${productData.name}:`, error);
            // Continue with next image
          }
        }

        console.log(`Successfully created product: ${productData.name}`);
      } catch (error) {
        console.error(`Failed to create product ${productData.name}:`, error);
        // Continue with next product
      }
    }
  }
}

export const storage = new DatabaseStorage();

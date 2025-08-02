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
  type InsertProductImage
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
    const [image] = await db
      .insert(productImages)
      .values(insertImage)
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

    // Initialize categories first
    const categoryData: InsertCategory[] = [
      {
        name: "Personal Scales",
        slug: "personal",
        description: "Used for personal body weight tracking",
        image: "https://i.ibb.co/9HgkXBKk/Personal-Scales.jpg",
        href: "/category/personal",
        title: "Personal Weighing Scales",
        parent_category: "root"
      },
      {
        name: "Jewelry Scales",
        slug: "jewelry",
        description: "Precision scales for jewelry and small items",
        image: "https://i.ibb.co/VYs04sr7/Jewellery-Scales.jpg",
        href: "/category/jewelry",
        title: "Jewelry Weighing Scales",
        parent_category: "root"
      },
      {
        name: "Industrial Scales",
        slug: "industrial",
        description: "Heavy-duty scales for industrial use",
        image: "https://i.ibb.co/bgsMDR7Z/Platform-Scales.jpg",
        href: "/category/industrial",
        title: "Industrial Weighing Scales",
        parent_category: "root"
      },
      {
        name: "Kitchen Scales",
        slug: "kitchen",
        description: "Scales for cooking and food preparation",
        image: "https://i.ibb.co/N2JY91bm/Kitchen-Scale.jpg",
        href: "/category/kitchen",
        title: "Kitchen Weighing Scales",
        parent_category: "root"
      },
      {
        name: "Dairy Scales",
        slug: "dairy",
        description: "Specialized scales for dairy operations",
        image: "https://i.ibb.co/rG45cVtC/Baby-Scales.jpg",
        href: "/category/dairy",
        title: "Dairy Weighing Scales",
        parent_category: "root"
      }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    
    // Create a map of category slugs to IDs
    const categoryMap = Object.fromEntries(
      insertedCategories.map(cat => [cat.slug, cat.id])
    );

    // Define product initialization data type
    type ProductInitData = {
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      featured: boolean;
      bestseller: boolean;
      new_arrival: boolean;
      accuracy: string;
      power_supply: string;
      display: string;
      material: string;
      warranty: string;
      certification: string;
    };

    // Helper function to create product and its image
    async function createProductWithImage(
      db: typeof import("./db").db,
      data: ProductInitData,
      categoryMap: Record<string, number>
    ) {
      try {
        const { image, category, ...productData } = data;
        
        if (!categoryMap[category]) {
          throw new Error(`Category ${category} not found in categoryMap`);
        }

        // Insert product
        const [insertedProduct] = await db
          .insert(products)
          .values({
            ...productData,
            category_id: categoryMap[category]
          })
          .returning();

        if (!insertedProduct?.id) {
          throw new Error("Failed to insert product");
        }

        // Create product image
        await db
          .insert(productImages)
          .values({
            product_id: insertedProduct.id,
            image_url: image,
            is_primary: true,
            alt_text: data.name,
            sort_order: 0
          });

        return insertedProduct;
      } catch (error: any) {
        console.error(`Failed to create product ${data.name}:`, error?.message || "Unknown error");
        throw error;
      }
    }

    // Initialize products with images
    const productData: ProductInitData[] = [
      {
        name: "Digital Body Scale",
        description: "Advanced personal scale with BMI measurement, weight tracking, and smartphone connectivity via Bluetooth. Features a sleek design with tempered glass platform and backlit display.",
        price: 2499,
        image: "https://images.unsplash.com/photo-1563796532290-e36c6a125465",
        category: "personal",
        featured: true,
        bestseller: true,
        new_arrival: false,
        accuracy: "±0.1kg",
        power_supply: "Battery/USB",
        display: "LCD Backlit",
        material: "Tempered Glass",
        warranty: "2 Years",
        certification: "ISO 9001"
      },
      {
        name: "Precision Jewelry Scale",
        description: "High-precision jewelry scale with 0.001g accuracy, ideal for gold, silver, gemstones, and other precious items. Features tare function, LCD display, and multiple weight units.",
        price: 8999,
        image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab0",
        category: "jewelry",
        featured: true,
        bestseller: false,
        new_arrival: true,
        accuracy: "±0.001g",
        power_supply: "Battery/AC",
        display: "LCD Digital",
        material: "Stainless Steel",
        warranty: "3 Years",
        certification: "ISO 9001"
      },
      {
        name: "Industrial Platform Scale",
        description: "Heavy-duty platform scale designed for industrial environments with 300kg capacity and 50g accuracy. Features durable stainless steel construction, rechargeable battery, and LCD display.",
        price: 16499,
        image: "https://images.unsplash.com/photo-1586528116493-ada99f9ba96b",
        category: "industrial",
        featured: true,
        bestseller: false,
        new_arrival: false,
        accuracy: "±50g",
        power_supply: "Rechargeable Battery",
        display: "LCD Digital",
        material: "Stainless Steel",
        warranty: "5 Years",
        certification: "ISO 9001"
      },
      {
        name: "Milk Collection Scale",
        description: "Specialized milk weighing scale with stainless steel construction for hygienic operations. Features tare function, waterproof design, and high accuracy suitable for dairy farms and milk collection centers.",
        price: 12999,
        image: "https://images.unsplash.com/photo-1563735704860-fe6924a46db1",
        category: "dairy",
        featured: true,
        bestseller: false,
        new_arrival: false,
        accuracy: "±10g",
        power_supply: "AC/Battery",
        display: "LCD Digital",
        material: "Stainless Steel",
        warranty: "3 Years",
        certification: "ISO 9001"
      },
      {
        name: "Digital Kitchen Scale",
        description: "Digital kitchen scale with high precision sensors for accurate cooking and baking. Features include tare function, multiple unit conversion, and tempered glass surface for easy cleaning.",
        price: 1499,
        image: "https://images.unsplash.com/photo-1570151443798-40a0fb296dfb",
        category: "kitchen",
        featured: true,
        bestseller: false,
        new_arrival: false,
        accuracy: "±1g",
        power_supply: "Battery",
        display: "LCD Digital",
        material: "Tempered Glass",
        warranty: "1 Year",
        certification: "ISO 9001"
      },
      {
        name: "Mechanical Bathroom Scale",
        description: "Analog mechanical bathroom scale with classic design and sturdy construction. Features large, easy-to-read dial display and non-slip surface for safety.",
        price: 999,
        image: "https://images.unsplash.com/photo-1563205764-79ea509b3e95",
        category: "personal",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±500g",
        power_supply: "Mechanical",
        display: "Analog Dial",
        material: "Metal/Plastic",
        warranty: "1 Year",
        certification: "ISO 9001"
      },
      {
        name: "Digital Crane Scale",
        description: "Heavy-duty hanging scale for industrial and commercial applications with 1000kg capacity. Features include digital display, remote control operation, and rechargeable battery.",
        price: 24999,
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
        category: "industrial",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±500g",
        power_supply: "Rechargeable Battery",
        display: "LED Digital",
        material: "Aluminum Alloy",
        warranty: "2 Years",
        certification: "ISO 9001"
      },
      {
        name: "Pocket Jewelry Scale",
        description: "Portable pocket scale for jewelers with 200g capacity and 0.01g accuracy. Compact design with protective flip cover, multiple weighing units, and calibration function.",
        price: 2999,
        image: "https://images.unsplash.com/photo-1609170012686-ecfda6f04489",
        category: "jewelry",
        featured: false,
        bestseller: true,
        new_arrival: false,
        accuracy: "±0.01g",
        power_supply: "Battery",
        display: "LCD Digital",
        material: "ABS Plastic",
        warranty: "1 Year",
        certification: "ISO 9001"
      },
      {
        name: "Smart Body Analyzer",
        description: "Advanced body composition analyzer with Bluetooth connectivity, smart app integration, and comprehensive health metrics tracking.",
        price: 4999,
        image: "https://images.unsplash.com/photo-1576073719676-aa95576db207",
        category: "personal",
        featured: false,
        bestseller: false,
        new_arrival: true,
        accuracy: "±0.1kg",
        power_supply: "Rechargeable Battery",
        display: "LED Digital",
        material: "Tempered Glass",
        warranty: "2 Years",
        certification: "ISO 9001"
      },
      {
        name: "Laboratory Precision Scale",
        description: "Ultra-high precision laboratory scale for scientific and research applications with 0.0001g accuracy and calibration certificates.",
        price: 35999,
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557",
        category: "jewelry",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±0.0001g",
        power_supply: "AC Power",
        display: "Digital LCD",
        material: "Stainless Steel",
        warranty: "5 Years",
        certification: "ISO 9001"
      },
      {
        name: "Commercial Bench Scale",
        description: "Commercial grade bench scale for retail and industrial applications with easy-to-clean stainless steel platform and bright LED display.",
        price: 9999,
        image: "https://images.unsplash.com/photo-1620293023555-272e1a661b26",
        category: "industrial",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±5g",
        power_supply: "AC/Battery",
        display: "LED Digital",
        material: "Stainless Steel",
        warranty: "3 Years",
        certification: "ISO 9001"
      },
      {
        name: "Digital Price Computing Scale",
        description: "Retail scale with price computing function, memory presets, and customer display ideal for grocery stores and markets.",
        price: 7499,
        image: "https://images.unsplash.com/photo-1617141636403-f511425889ed",
        category: "industrial",
        featured: false,
        bestseller: false,
        new_arrival: true,
        accuracy: "±2g",
        power_supply: "AC/Battery",
        display: "Dual LCD",
        material: "ABS Plastic/Steel",
        warranty: "2 Years",
        certification: "ISO 9001"
      },
      {
        name: "Livestock Weighing Platform",
        description: "Heavy-duty livestock weighing platform for farms and agricultural applications, with durable construction and high capacity.",
        price: 49999,
        image: "https://images.unsplash.com/photo-1623461487986-9400110de28e",
        category: "industrial",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±100g",
        power_supply: "AC Power",
        display: "LED Digital",
        material: "Steel",
        warranty: "5 Years",
        certification: "ISO 9001"
      },
      {
        name: "Digital Infant Scale",
        description: "Specially designed infant scale with safety features, accurate measurements, and comfortable tray for newborns and toddlers.",
        price: 6999,
        image: "https://images.unsplash.com/photo-1563376047-6e8e4b99eec9",
        category: "personal",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±5g",
        power_supply: "Battery",
        display: "LCD Digital",
        material: "ABS Plastic",
        warranty: "2 Years",
        certification: "ISO 9001"
      },
      {
        name: "Gold Testing Scale",
        description: "Professional gold testing scale with high precision for jewelers and gold buyers, includes density measurement accessories.",
        price: 19999,
        image: "https://images.unsplash.com/photo-1610447847416-40bac442aae4",
        category: "jewelry",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±0.001g",
        power_supply: "AC/Battery",
        display: "LCD Digital",
        material: "Stainless Steel",
        warranty: "3 Years",
        certification: "ISO 9001"
      },
      {
        name: "Digital Postal Scale",
        description: "Compact postal scale for accurate package weighing, ideal for small businesses and home offices with shipping needs.",
        price: 2999,
        image: "https://images.unsplash.com/photo-1586363293694-aaa3c72259c2",
        category: "industrial",
        featured: false,
        bestseller: false,
        new_arrival: false,
        accuracy: "±1g",
        power_supply: "Battery/USB",
        display: "LCD Digital",
        material: "ABS Plastic",
        warranty: "1 Year",
        certification: "ISO 9001"
      }
    ];
    
    // Insert all products and their images sequentially
    for (const product of productData) {
      try {
        await createProductWithImage(db, product, categoryMap);
        console.log(`Successfully created product: ${product.name}`);
      } catch (error) {
        console.error(`Failed to create product ${product.name}`);
        // Continue with next product
      }
    }
  }
}

export const storage = new DatabaseStorage();

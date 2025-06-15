import { 
  users, 
  type User, 
  type InsertUser, 
  products, 
  type Product, 
  type InsertProduct,
  contactMessages,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
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
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
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
  
  // Initialize with sample products
  async initializeProducts() {
    // Check if products already exist in database
    const existingProducts = await db.select().from(products);
    if (existingProducts.length > 0) {
      return; // Products already initialized
    }
    const productData: InsertProduct[] = [
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
    
    // Insert all products into database
    await db.insert(products).values(productData);
  }
}

export const storage = new DatabaseStorage();

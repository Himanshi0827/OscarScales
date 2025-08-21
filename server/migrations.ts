import { db } from "./db.js";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  console.log("Running database migrations...");

  try {
    // Create tables if they don't exist
    console.log("Ensuring tables exist...");
    const createTables = [
      sql`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        href TEXT NOT NULL,
        title TEXT NOT NULL,
        parent_category TEXT DEFAULT 'root'
      )`,

      sql`CREATE TABLE IF NOT EXISTS category_images (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        display_url TEXT NOT NULL,
        thumb_url TEXT NOT NULL,
        delete_url TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT false,
        alt_text TEXT,
        sort_order INTEGER DEFAULT 0
      )`,

      sql`CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        featured BOOLEAN DEFAULT false,
        bestseller BOOLEAN DEFAULT false,
        new_arrival BOOLEAN DEFAULT false,
        rating DECIMAL(3,1) DEFAULT '0',
        review_count INTEGER DEFAULT 0,
        accuracy TEXT,
        power_supply TEXT,
        display TEXT,
        material TEXT,
        warranty TEXT,
        certification TEXT
      )`,

      sql`CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        display_url TEXT NOT NULL,
        thumb_url TEXT NOT NULL,
        delete_url TEXT NOT NULL,
        is_primary BOOLEAN DEFAULT false,
        alt_text TEXT,
        sort_order INTEGER DEFAULT 0
      )`
    ];

    for (const query of createTables) {
      await db.execute(query);
    }

    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}
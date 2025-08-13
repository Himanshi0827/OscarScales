import { db } from "./db";
import { sql } from "drizzle-orm";

export async function runMigrations() {
  console.log("Running database migrations...");

  try {
    // Drop existing tables
    console.log("Dropping existing tables...");
    const dropTables = [
      sql`DROP TABLE IF EXISTS product_images CASCADE`,
      sql`DROP TABLE IF EXISTS category_images CASCADE`,
      sql`DROP TABLE IF EXISTS products CASCADE`,
      sql`DROP TABLE IF EXISTS categories CASCADE`
    ];

    for (const query of dropTables) {
      await db.execute(query);
    }

    // Create tables in order
    console.log("Creating tables...");
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
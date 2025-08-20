import { pgTable, text, serial, integer, boolean, varchar, foreignKey, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  href: text("href").notNull(),
  title: text("title").notNull(),
  parent_category: text("parent_category").default("root"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Category Images schema
export const categoryImages = pgTable("category_images", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  image_url: text("image_url").notNull(),
  display_url: text("display_url").notNull(),
  thumb_url: text("thumb_url").notNull(),
  delete_url: text("delete_url").notNull(),
  is_primary: boolean("is_primary").default(false),
  alt_text: text("alt_text"),
  sort_order: integer("sort_order").default(0),
});

export const insertCategoryImageSchema = createInsertSchema(categoryImages).omit({
  id: true,
});

// Product Images schema
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  image_url: text("image_url").notNull(),
  display_url: text("display_url").notNull(),
  thumb_url: text("thumb_url").notNull(),
  delete_url: text("delete_url").notNull(),
  is_primary: boolean("is_primary").default(false),
  alt_text: text("alt_text"),
  sort_order: integer("sort_order").default(0),
});

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
});

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category_id: integer("category_id")
    .references(() => categories.id),  // Make it nullable initially
  featured: boolean("featured").default(false),
  bestseller: boolean("bestseller").default(false),
  new_arrival: boolean("new_arrival").default(false),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),  // Rating out of 5 with one decimal place
  review_count: integer("review_count").default(0),
  accuracy: text("accuracy"),
  power_supply: text("power_supply"),
  display: text("display"),
  material: text("material"),
  warranty: text("warranty"),
  certification: text("certification"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
});

// Types
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertCategoryImage = z.infer<typeof insertCategoryImageSchema>;
export type CategoryImage = typeof categoryImages.$inferSelect;

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

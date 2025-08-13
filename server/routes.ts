import type { Express, Request, Response } from "express";
import type { Request as MulterRequest } from "express-serve-static-core";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactMessageSchema,
  insertProductSchema,
  insertCategorySchema,
  insertCategoryImageSchema,
  insertProductImageSchema
} from "@shared/schema";
import { sendContactEmail } from "./email";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { login, authenticateToken, verifyToken, AuthRequest } from "./auth";
import multer from "multer";
import { getImgBBService } from "./imgbb";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with sample data (only runs once)
  await storage.initializeDatabase();

  // API routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      
      // Fetch primary image for each product
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const primaryImage = await storage.getPrimaryProductImage(product.id);
          return {
            ...product,
            image: primaryImage?.display_url || null
          };
        })
      );
      
      res.json(productsWithImages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Get product images
      const images = await storage.getProductImages(id);
      
      res.json({
        ...product,
        images: images
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      
      // Fetch images for each category
      const categoriesWithImages = await Promise.all(
        categories.map(async (category) => {
          const images = await storage.getCategoryImages(category.id);
          const primaryImage = images.find(img => img.is_primary) || images[0];
          return {
            ...category,
            image: primaryImage?.display_url || null
          };
        })
      );
      
      res.json(categoriesWithImages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Category Management Routes (Protected)
  app.post("/api/admin/categories", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = req.body;
      const category = await storage.updateCategory(id, categoryData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Category Image Management Routes (Protected)
  app.get("/api/admin/categories/:id/images", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const images = await storage.getCategoryImages(categoryId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching category images:", error);
      res.status(500).json({ message: "Failed to fetch category images" });
    }
  });

  app.post("/api/admin/categories/:id/images", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const categoryId = parseInt(req.params.id);
      const imageData = insertCategoryImageSchema.parse({
        ...req.body,
        category_id: categoryId
      });
      const image = await storage.createCategoryImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create category image" });
    }
  });

  app.put("/api/admin/categories/images/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const imageData = req.body;
      const image = await storage.updateCategoryImage(id, imageData);
      
      if (!image) {
        return res.status(404).json({ message: "Category image not found" });
      }
      
      res.json(image);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category image" });
    }
  });

  app.delete("/api/admin/categories/images/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategoryImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Category image not found" });
      }
      
      res.json({ message: "Category image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category image" });
    }
  });

  app.get("/api/products/category/:slug", async (req: Request, res: Response) => {
    try {
      const slug = req.params.slug;
      const products = await storage.getProductsByCategorySlug(slug);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/bestsellers", async (req: Request, res: Response) => {
    try {
      const products = await storage.getBestsellerProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bestseller products" });
    }
  });

  app.get("/api/products/new-arrivals", async (req: Request, res: Response) => {
    try {
      const products = await storage.getNewArrivalProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new arrival products" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      
      // First store the message in database
      const message = await storage.createContactMessage(contactData);
      
      // Then send emails
      await sendContactEmail(message);
      
      res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error('Contact form error:', error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Auth routes
  app.post("/api/auth/login", login);
  app.get("/api/auth/verify", authenticateToken, verifyToken);

  // Admin routes for product management (protected)
  app.post("/api/admin/products", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const productData = req.body;
      const product = await storage.updateProduct(id, productData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Image Management Routes
  app.get("/api/products/:id/images", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const images = await storage.getProductImages(productId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching product images:", error);
      res.status(500).json({ message: "Failed to fetch product images" });
    }
  });

  app.post("/api/admin/products/:id/images", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      const imageData = insertProductImageSchema.parse({
        ...req.body,
        product_id: productId
      });
      const image = await storage.createProductImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating product image:", error);
      res.status(500).json({ message: "Failed to create product image" });
    }
  });

  app.put("/api/admin/products/images/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const imageData = req.body;
      const image = await storage.updateProductImage(id, imageData);
      
      if (!image) {
        return res.status(404).json({ message: "Product image not found" });
      }
      
      res.json(image);
    } catch (error) {
      console.error("Error updating product image:", error);
      res.status(500).json({ message: "Failed to update product image" });
    }
  });

  app.delete("/api/admin/products/images/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProductImage(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product image not found" });
      }
      
      res.json({ message: "Product image deleted successfully" });
    } catch (error) {
      console.error("Error deleting product image:", error);
      res.status(500).json({ message: "Failed to delete product image" });
    }
  });

  app.get("/api/admin/contacts", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const contacts = await storage.getContactMessages();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Image upload routes
  app.post("/api/upload", upload.single("image"), async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imgbb = getImgBBService();
      const base64Image = req.file.buffer.toString("base64");
      const response = await imgbb.uploadImage(base64Image, req.file.originalname);

      res.json(response);
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/delete-image", async (req: Request, res: Response) => {
    try {
      const { deleteUrl } = req.body;
      if (!deleteUrl) {
        return res.status(400).json({ message: "No delete URL provided" });
      }

      const imgbb = getImgBBService();
      const success = await imgbb.deleteImage(deleteUrl);

      if (success) {
        res.json({ message: "Image deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete image" });
      }
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

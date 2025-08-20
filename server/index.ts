import { config } from "dotenv";
config();

import express, { type Request, Response, NextFunction } from "express";
import { initImgBBService } from "./imgbb.js";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite";
import { runMigrations } from "./migrations";

initImgBBService();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Initialize app (migrations and routes)
let initialized = false;
async function initialize() {
  if (!initialized) {
    await runMigrations();
    await registerRoutes(app);
    initialized = true;
  }
}

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}

// Export the serverless handler
export default async function handler(req: Request, res: Response) {
  await initialize();
  return app(req, res);
}
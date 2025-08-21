import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  // In production, let Vercel handle static files (never serve from Node)
  if (process.env.NODE_ENV === "production") {
    return;
  }

  // Local development fallback
  const distPath = path.join(__dirname, "..", "dist");

  log(`Serving static files locally from: ${distPath}`, "serveStatic");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to run "npm run build"`
    );
  }

  app.use(express.static(distPath));

  // Fall back to index.html for SPA routing in dev
  app.use("*", (_req, res) => {
    log(`Fallback triggered for path: ${_req.originalUrl}`, "serveStatic");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}


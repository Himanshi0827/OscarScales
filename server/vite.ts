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
  // In production, Vercel handles static files
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const distPath = path.join(__dirname, '..', 'dist');

  log(`Serving static files from: ${distPath}`, "serveStatic");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html for SPA routing in development
  app.use("*", (_req, res) => {
    log(`Fallback triggered for path: ${_req.originalUrl}`, "serveStatic");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

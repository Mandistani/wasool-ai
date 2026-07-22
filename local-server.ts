import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import app from "./server.ts";

const PORT = 3000;

// This file is ONLY for running the app locally (npm run dev) or as a standalone
// Node server (npm start). Vercel's serverless functions import server.ts directly
// and never touch this file, so vite (an ESM-only package, unnecessary in
// production/serverless) never ends up in the Vercel function bundle.
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

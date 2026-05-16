/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.use(express.json({ limit: '10mb' }));

  // AI Scan Route
  app.post("/api/scan", async (req, res) => {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Missing image" });

    try {
      const prompt = "Identify the World Cup sticker number and team (3-letter code like BRA, ARG, MEX) OR special collection ID (like CC-1, SP-5, LEG-10) in this image. Response format: [ID]. Examples: BRA-10, CC-2, LEG-15. If nothing is found, respond: NULL.";
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          { text: prompt },
          {
            inlineData: {
              data: image.split(',')[1] || image,
              mimeType: "image/jpeg"
            }
          }
        ]
      });

      const text = response.text?.trim() || "NULL";
      res.json({ stickerId: text === "NULL" ? null : text });
    } catch (error) {
      console.error("AI Scan Error:", error);
      res.status(500).json({ error: "Failed to scan image" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

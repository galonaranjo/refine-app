import "dotenv/config";
import express from "express";
import cors from "cors";
import cloudinary from "./config/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { apiLimiter, uploadLimiter, failedUploadLimiter } from "./middleware/rateLimiter.js";
import {
  validateFileSize,
  validateFileType,
  validateFileName,
} from "./middleware/fileValidation.js";

const app = express();

// Update CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",") || ["https://refine.fly.dev"]
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  })
);

app.use(apiLimiter);

// Add headers middleware
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Verify Cloudinary credentials are loaded
console.log("Cloudinary Config Status:", {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "wmv"],
    transformation: [{ quality: "auto" }],
  },
});

const upload = multer({ storage: storage });

app.post(
  "/api/upload",
  uploadLimiter,
  validateFileSize,
  upload.single("video"),
  validateFileType,
  validateFileName,
  async (req, res) => {
    try {
      if (!req.file) {
        failedUploadLimiter(req, res, () => {
          return res.status(400).json({ error: "No video file provided" });
        });
        return;
      }

      // Add file size logging for monitoring
      console.log(`Upload size: ${req.file.size / (1024 * 1024)}MB`);

      // Create shareableUrl using the full Cloudinary URL
      const shareableUrl = `/feedback?video=${req.file.path}`;
      console.log(shareableUrl);
      res.json({
        success: true,
        shareableUrl,
        public_id: req.file.filename,
        format: req.file.format,
      });
    } catch (error) {
      failedUploadLimiter(req, res, () => {
        console.error("Upload error details:", error);
        res.status(500).json({
          error: "Upload failed",
          details: error.message,
        });
      });
    }
  }
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});

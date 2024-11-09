import "dotenv/config";
import express from "express";
import cors from "cors";
import cloudinary from "./config/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import crypto from "crypto";

const app = express();
app.use(cors());

// Verify Cloudinary credentials are loaded
console.log("Cloudinary Config Status:", {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    public_id: (req, file) => crypto.randomUUID(),
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "wmv"],
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    const coachingUrl = `/feedback/${req.file.filename}`;

    res.json({
      success: true,
      url: req.file.path,
      coachingUrl: coachingUrl,
      public_id: req.file.filename,
      format: req.file.format,
    });
  } catch (error) {
    console.error("Upload error details:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error.message,
    });
  }
});

app.get("/api/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Search Cloudinary for the video using the public_id (which is our uniqueId)
    const result = await cloudinary.api.resource(id, { resource_type: "video" });

    if (!result) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      duration: result.duration,
      created_at: result.created_at,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(404).json({ error: "Video not found" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

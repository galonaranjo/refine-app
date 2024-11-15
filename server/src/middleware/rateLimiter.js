import rateLimit from "express-rate-limit";

// Basic API limiter for general endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: "Too many requests, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for video uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // 5 uploads per hour
  message: "Upload limit reached. Please try again in an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for failed attempts
const failedUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 failed attempts per hour
  message: "Too many failed uploads. Please try again later.",
});

export { apiLimiter, uploadLimiter, failedUploadLimiter };

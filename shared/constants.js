/**
 * Shared constants used across both client and server
 *
 * This file contains configuration values and settings that need to be consistent
 * between the frontend and backend. By keeping them in a shared location, we avoid
 * duplicating values and ensure they stay in sync.
 *
 * Potential future additions:
 * - API endpoint paths
 * - Rate limiting settings
 * - Validation rules
 * - Feature flags
 * - UI constants (sizes, colors, etc)
 * - Error messages
 * - Supported file formats
 * - Default values
 */

export const VIDEO_SETTINGS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_TYPES: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"],
  EXPIRATION_DAYS: 7, // Videos will be deleted after 7 days
};

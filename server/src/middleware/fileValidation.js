import { VIDEO_SETTINGS } from "../../../shared/constants.js";

export const validateFileSize = (req, res, next) => {
  if (req.headers["content-length"] > VIDEO_SETTINGS.MAX_FILE_SIZE) {
    return res.status(413).json({
      error: "File too large",
      maxSize: "100MB",
      receivedSize: `${(req.headers["content-length"] / (1024 * 1024)).toFixed(2)}MB`,
    });
  }
  next();
};

export const validateFileType = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!VIDEO_SETTINGS.ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(415).json({
      error: "Invalid file type",
      message: "Only MP4, MOV, AVI, and WMV files are allowed",
      received: req.file.mimetype,
      allowed: VIDEO_SETTINGS.ALLOWED_TYPES,
    });
  }
  next();
};

export const validateFileName = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Validate filename length
  if (req.file.originalname.length > 200) {
    return res.status(400).json({
      error: "Invalid filename",
      message: "Filename is too long (max 200 characters)",
    });
  }

  // Validate filename characters (alphanumeric, dash, underscore, dot, space)
  const validFilename = /^[a-zA-Z0-9-_. ]+$/;
  if (!validFilename.test(req.file.originalname)) {
    return res.status(400).json({
      error: "Invalid filename",
      message: "Filename contains invalid characters",
    });
  }

  next();
};

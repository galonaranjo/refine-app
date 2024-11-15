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

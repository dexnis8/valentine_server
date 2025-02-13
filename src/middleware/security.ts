import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { Request, Response, NextFunction } from "express";

// Rate limiting configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for gift creation
export const createGiftLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 gift creations per hour
  message: "Gift creation limit reached, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// API Key validation middleware
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or missing API key",
    });
  }

  next();
};

// Request size limiter middleware
export const requestSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (
    req.headers["content-length"] &&
    parseInt(req.headers["content-length"]) > maxSize
  ) {
    return res.status(413).json({
      status: "error",
      message: "Request entity too large",
    });
  }
  next();
};

// Sanitize data middleware
export const sanitizeData = [
  // Sanitize request data to prevent NoSQL injection
  mongoSanitize(),
  // Prevent parameter pollution
  hpp(),
];

// Validate content type middleware
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (!req.is("application/json")) {
      return res.status(415).json({
        status: "error",
        message: "Content-Type must be application/json",
      });
    }
  }
  next();
};

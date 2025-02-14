import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { sanitize } from "express-mongo-sanitize";

// Rate limiter for template viewing - 500 views per 15 minutes per IP
export const templateViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per windowMs
  message:
    "Too many template views from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for gift viewing - 300 views per 15 minutes per IP
export const giftViewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per windowMs
  message:
    "Too many gift views from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for gift creation - 50 creations per hour per IP
export const createGiftLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per windowMs
  message:
    "Too many gift creations from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// API Key validation middleware
export const validateApiKey: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    res.status(401).json({
      status: "error",
      message: "Invalid or missing API key",
    });
    return;
  }

  next();
};

// Request size limiter middleware
export const requestSizeLimiter: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (
    req.headers["content-length"] &&
    parseInt(req.headers["content-length"]) > maxSize
  ) {
    res.status(413).json({
      status: "error",
      message: "Request entity too large",
    });
    return;
  }
  next();
};

// Sanitize data middleware
export const sanitizeData = [
  // Sanitize request data to prevent NoSQL injection
  mongoSanitize() as RequestHandler,
  // Prevent parameter pollution
  hpp() as RequestHandler,
];

// Validate content type middleware
export const validateContentType: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (!req.is("application/json")) {
      res.status(415).json({
        status: "error",
        message: "Content-Type must be application/json",
      });
      return;
    }
  }
  next();
};

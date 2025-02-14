import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import giftRoutes from "./routes/giftRoutes";
import templateRoutes from "./routes/templateRoutes";
import {
  limiter,
  sanitizeData,
  validateContentType,
  requestSizeLimiter,
} from "./middleware/security";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  })
);

// CORS configuration
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN,
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Key",
      "X-Gift-Password",
    ],
    credentials: true,
    maxAge: 600, // 10 minutes
  })
);

// Request parsing and size limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(requestSizeLimiter);

// Content type validation
app.use(validateContentType);

// Data sanitization
app.use(sanitizeData);

// Routes
app.use("/api/gifts", giftRoutes);
app.use("/api/templates", templateRoutes);

// Error handling
app.use(errorHandler);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Connect to MongoDB with security options
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing HTTP server...");
  mongoose.connection.close(false).then(() => {
    console.log("MongoDB connection closed.");
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    // console.error(err);
    server.close(() => {
      process.exit(1);
    });
  });
});

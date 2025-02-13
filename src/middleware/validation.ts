import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Invalid input data",
      errors: errors.array(),
    });
  }
  next();
};

export const createGiftValidation = [
  body("templateId")
    .notEmpty()
    .withMessage("Template ID is required")
    .isMongoId()
    .withMessage("Invalid template ID format"),
  body("senderName")
    .notEmpty()
    .withMessage("Sender name is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Sender name must be between 2 and 50 characters"),
  body("customMessage")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Custom message cannot exceed 500 characters"),
  body("password")
    .optional()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must be between 6 and 50 characters"),
  body("scheduledFor")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const date = new Date(value);
      if (date < new Date()) {
        throw new Error("Scheduled date must be in the future");
      }
      return true;
    }),
  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value, { req }) => {
      const expiryDate = new Date(value);
      const scheduledDate = req.body.scheduledFor
        ? new Date(req.body.scheduledFor)
        : new Date();
      if (expiryDate <= scheduledDate) {
        throw new Error("Expiry date must be after scheduled date");
      }
      return true;
    }),
  validateRequest,
];

export const getGiftValidation = [
  param("id").isMongoId().withMessage("Invalid gift ID format"),
  validateRequest,
];

export const createTemplateValidation = [
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Message must be between 5 and 200 characters"),
  body("theme")
    .notEmpty()
    .withMessage("Theme is required")
    .isIn([
      "romantic",
      "tech-love",
      "tech-romantic",
      "cute-tech",
      "cute",
      "poetic",
      "classic-romantic",
      "playful-tech",
      "elegant",
    ])
    .withMessage("Invalid theme"),
  body("imageUrl")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Invalid image URL"),
  validateRequest,
];

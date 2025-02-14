import { Request, Response, NextFunction } from "express";
import { body, param, validationResult, Meta } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Invalid input data",
      errors: errors.array(),
    });
    return;
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
    .custom((value: string) => {
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
    .custom((value: string, meta: Meta) => {
      const expiryDate = new Date(value);
      const scheduledDate = meta.req.body.scheduledFor
        ? new Date(meta.req.body.scheduledFor)
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

// Update gift validation
export const updateGiftValidation = [
  param("id").isMongoId().withMessage("Invalid gift ID"),
  body("message")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Message must be between 1 and 500 characters"),
  body("templateId").optional().isMongoId().withMessage("Invalid template ID"),
  body("password")
    .optional()
    .isString()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }
    next();
  },
];

// Delete gift validation
export const deleteGiftValidation = [
  param("id").isMongoId().withMessage("Invalid gift ID"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }
    next();
  },
];

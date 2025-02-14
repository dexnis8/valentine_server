import express from "express";
import {
  createGift,
  getGift,
  getTemplate,
  getTemplates,
  updateGift,
  deleteGift,
} from "../controllers/giftController";
import {
  createGiftValidation,
  getGiftValidation,
  updateGiftValidation,
  deleteGiftValidation,
} from "../middleware/validation";
import {
  validateApiKey,
  createGiftLimiter,
  templateViewLimiter,
  giftViewLimiter,
} from "../middleware/security";

const router = express.Router();

// Public routes
router.get("/templates", templateViewLimiter, getTemplates);
router.get(
  "/templates/:id",
  templateViewLimiter,
  getGiftValidation,
  getTemplate
);
router.get("/:id", giftViewLimiter, getGiftValidation, getGift);

// Protected routes (require API key)
router.use(validateApiKey);
router.post("/", createGiftLimiter, createGiftValidation, createGift);
router.patch("/:id", updateGiftValidation, updateGift);
router.delete("/:id", deleteGiftValidation, deleteGift);

export default router;

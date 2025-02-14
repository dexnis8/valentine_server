import express from "express";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from "../controllers/templateController";
import { validateApiKey, templateViewLimiter } from "../middleware/security";
import {
  createTemplateValidation,
  getGiftValidation,
} from "../middleware/validation";

const router = express.Router();

// Public routes with rate limiting
router.get("/", templateViewLimiter, getTemplates);
router.get("/:id", templateViewLimiter, getGiftValidation, getTemplate);

// Protected routes (require API key)
router.use(validateApiKey);
router.post("/", createTemplateValidation, createTemplate);
router.patch("/:id", createTemplateValidation, updateTemplate);
router.delete("/:id", getGiftValidation, deleteTemplate);

export default router;

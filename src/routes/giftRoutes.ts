import express from "express";
import {
  createGift,
  getGift,
  markGiftAsOpened,
} from "../controllers/giftController";
import { createGiftLimiter } from "../middleware/security";
import {
  createGiftValidation,
  getGiftValidation,
} from "../middleware/validation";

const router = express.Router();

router.route("/").post(createGiftLimiter, createGiftValidation, createGift);

router.route("/:id").get(getGiftValidation, getGift);

router.route("/:id/open").patch(getGiftValidation, markGiftAsOpened);

export default router;

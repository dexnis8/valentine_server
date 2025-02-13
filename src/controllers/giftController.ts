import { Request, Response, NextFunction } from "express";
import { Gift } from "../models/Gift";
import { Template } from "../models/Template";
import { AppError } from "../middleware/errorHandler";

// Create a new gift
export const createGift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the template
    const template = await Template.findById(req.body.templateId);
    if (!template || !template.isActive) {
      return next(new AppError("Template not found or inactive", 404));
    }

    // Create the gift with template data and a default senderId
    const gift = await Gift.create({
      ...req.body,
      senderId: "anonymous", // Add default senderId
      theme: template.theme,
      imageUrl: template.imageUrl,
      message: template.message, // Include the template message
    });

    res.status(201).json({
      status: "success",
      data: gift,
    });
  } catch (error) {
    next(error);
  }
};

// Get a gift by ID
export const getGift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return next(new AppError("Gift not found", 404));
    }

    // Check if gift is password protected
    if (gift.hasPassword) {
      const password = req.headers["x-gift-password"];

      if (!password) {
        return res.status(200).json({
          status: "success",
          data: {
            _id: gift._id,
            hasPassword: true,
          },
        });
      }

      const isPasswordCorrect = await gift.checkPassword(
        password as string,
        gift.password as string
      );

      if (!isPasswordCorrect) {
        return next(new AppError("Invalid password", 401));
      }
    }

    // Check if gift has expired
    if (gift.expiresAt && new Date(gift.expiresAt) < new Date()) {
      return next(new AppError("This gift has expired", 410));
    }

    // Check if gift is scheduled for future
    if (gift.scheduledFor && new Date(gift.scheduledFor) > new Date()) {
      return next(new AppError("This gift is not available yet", 403));
    }

    res.status(200).json({
      status: "success",
      data: gift,
    });
  } catch (error) {
    next(error);
  }
};

// Mark gift as opened
export const markGiftAsOpened = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      { isOpened: true },
      { new: true }
    );

    if (!gift) {
      return next(new AppError("Gift not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: gift,
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from "express";
import { Gift } from "../models/Gift";
import { Template } from "../models/Template";
import { AppError } from "../middleware/errorHandler";

// Create a new gift
export const createGift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the template
    const template = await Template.findById(req.body.templateId);
    if (!template || !template.isActive) {
      next(new AppError("Template not found or inactive", 404));
      return;
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
): Promise<void> => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      next(new AppError("Gift not found", 404));
      return;
    }

    // Check if gift is password protected
    if (gift.hasPassword) {
      const password = req.headers["x-gift-password"];

      if (!password) {
        res.status(200).json({
          status: "success",
          data: {
            _id: gift._id,
            hasPassword: true,
          },
        });
        return;
      }

      if (!gift.password) {
        next(new AppError("Gift password not set", 500));
        return;
      }

      const isPasswordCorrect = await gift.checkPassword(
        password as string,
        gift.password
      );

      if (!isPasswordCorrect) {
        next(new AppError("Invalid password", 401));
        return;
      }
    }

    // Check if gift has expired
    if (gift.expiresAt && new Date(gift.expiresAt) < new Date()) {
      next(new AppError("This gift has expired", 410));
      return;
    }

    // Check if gift is scheduled for future
    if (gift.scheduledFor && new Date(gift.scheduledFor) > new Date()) {
      next(new AppError("This gift is not available yet", 403));
      return;
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
): Promise<void> => {
  try {
    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      { isOpened: true },
      { new: true }
    );

    if (!gift) {
      next(new AppError("Gift not found", 404));
      return;
    }

    res.status(200).json({
      status: "success",
      data: gift,
    });
  } catch (error) {
    next(error);
  }
};

// Get all templates
export const getTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const templates = await Template.find({ isActive: true }).sort(
      "-createdAt"
    );
    res.status(200).json({
      status: "success",
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// Get template by ID
export const getTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      next(new AppError("Template not found", 404));
      return;
    }
    res.status(200).json({
      status: "success",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Update a gift
export const updateGift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gift = await Gift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!gift) {
      next(new AppError("Gift not found", 404));
      return;
    }

    res.status(200).json({
      status: "success",
      data: gift,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a gift
export const deleteGift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);

    if (!gift) {
      next(new AppError("Gift not found", 404));
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

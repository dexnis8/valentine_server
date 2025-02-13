import { Request, Response, NextFunction } from "express";
import { Template } from "../models/Template";
import { AppError } from "../middleware/errorHandler";

// Get all active templates
export const getTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Create new template
export const createTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = await Template.create(req.body);

    res.status(201).json({
      status: "success",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Update template
export const updateTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// Delete template (soft delete by setting isActive to false)
export const deleteTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!template) {
      return next(new AppError("Template not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

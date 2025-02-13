import mongoose from "mongoose";

export type GiftTheme =
  | "romantic"
  | "tech-love"
  | "cute-tech"
  | "cute"
  | "poetic"
  | "classic-romantic"
  | "tech-romantic"
  | "playful-tech"
  | "elegant";

const templateSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "A template must have a message"],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, "A template must have a theme"],
      enum: [
        "romantic",
        "tech-love",
        "tech-romantic",
        "cute-tech",
        "cute",
        "poetic",
        "classic-romantic",
        "playful-tech",
        "elegant",
      ],
    },
    imageUrl: {
      type: String,
      required: [true, "A template must have an image URL"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
templateSchema.index({ theme: 1 });
templateSchema.index({ isActive: 1 });

export const Template = mongoose.model("Template", templateSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { GiftTheme } from "./Template";

// Define the interface for Gift document
interface IGift extends mongoose.Document {
  templateId: mongoose.Types.ObjectId;
  senderId: string;
  senderName: string;
  customMessage?: string;
  message: string;
  theme: GiftTheme;
  imageUrl: string;
  scheduledFor?: Date;
  isOpened: boolean;
  expiresAt?: Date;
  password?: string;
  hasPassword: boolean;
  checkPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const giftSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: [true, "A gift must be based on a template"],
    },
    senderId: {
      type: String,
      required: [true, "A gift must have a sender ID"],
    },
    senderName: {
      type: String,
      required: [true, "A gift must have a sender name"],
      trim: true,
    },
    customMessage: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "A gift must have a template message"],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, "A gift must have a theme"],
      enum: ["romantic", "funny", "friendly", "cute", "elegant"],
    },
    imageUrl: {
      type: String,
      required: [true, "A gift must have an image URL"],
    },
    scheduledFor: {
      type: Date,
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    password: String,
    hasPassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
giftSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
    this.hasPassword = true;
  }

  next();
});

// Method to check password
giftSchema.methods.checkPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create indexes
giftSchema.index({ senderId: 1 });
giftSchema.index({ scheduledFor: 1 });
giftSchema.index({ expiresAt: 1 });
giftSchema.index({ createdAt: 1 });

export const Gift = mongoose.model<IGift>("Gift", giftSchema);

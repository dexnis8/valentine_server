import mongoose from "mongoose";
import dotenv from "dotenv";
import { Template } from "../models/Template";

dotenv.config();

const templates = [
  {
    message: "You mean the world to me! ❤️",
    theme: "romantic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739479306/tbp_files/ybjcs1kavmzghuhtwa2j.jpg",
    isActive: true,
  },
  {
    message: "You make my heart skip a beat! 💝",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500",
    isActive: true,
  },
  {
    message: "Roses are red, violets are blue, no one is as special as you! 🌹",
    theme: "poetic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739473836/tbp_files/raydtssiy1aitkurmney.jpg",
    isActive: true,
  },
  {
    message: "Sending you a virtual hug! 😘",
    theme: "romantic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739477009/tbp_files/nocnfpujmfwu9bqtosyu.jpg",
    isActive: true,
  },
  // "http://res.cloudinary.com/docfy0nxa/image/upload/v1739473836/tbp_files/hyex9e1qh4hwyfe9p0zm.jpg",
  {
    message: "Every day with you is Valentine's Day! ✨",
    theme: "elegant",
    imageUrl:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500",
    isActive: true,
  },
  {
    message: "You're my favorite notification! 📱",
    theme: "tech-love",
    imageUrl:
      "http://res.cloudinary.com/docfy0nxa/image/upload/v1739473836/tbp_files/d1iajodcpoyzyn25lgvj.jpg",
    isActive: true,
  },
  // New templates
  {
    message: "Together is my favorite place to be 🏡",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=500",
    isActive: true,
  },

  {
    message: "Where there is love, there is life! 😊",
    theme: "poetic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739473836/tbp_files/jyqreaqg4jygvrwdqexf.jpg",
    isActive: true,
  },
  {
    message: "Like Git, I'm committed to you! 💕",
    theme: "tech-love",
    imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500",
    isActive: true,
  },
  {
    message: "You're the algorithm to my heart! 💝",
    theme: "tech-love",
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500",
    isActive: true,
  },
  {
    message: "Elegantly yours, forever and always ✨",
    theme: "elegant",
    imageUrl:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=500",
    isActive: true,
  },
  {
    message: "You make my world more beautiful 🌸",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500",
    isActive: true,
  },

  {
    message: "Sending love at the speed of light! ⚡️",
    theme: "cute",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739473836/tbp_files/k5fboj1bskj8zghlb4in.jpg",
    isActive: true,
  },

  {
    message: "Love is in the air... and in the code! 💻💕",
    theme: "tech-love",
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500",
    isActive: true,
  },
  // New romantic templates
  {
    message:
      "In your eyes, I found my home, in your heart, I found my peace 🌟",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500",
    isActive: true,
  },
  {
    message: "Every moment with you feels like a beautiful dream come true 💫",
    theme: "elegant",
    imageUrl:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500",
    isActive: true,
  },
  {
    message: "My heart dances to the rhythm of your love 💃❤️",
    theme: "poetic",
    imageUrl:
      "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=500",
    isActive: true,
  },
  {
    message: "A thousand stars can't outshine the sparkle in your eyes ✨",
    theme: "poetic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739479306/tbp_files/cpn7ooyrwjbwduoswc7a.jpg",
    isActive: true,
  },
  {
    message: "Forever isn't long enough when I'm with you 💕",
    theme: "romantic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739479306/tbp_files/otg3k7oprldhhczztgw5.jpg",
    isActive: true,
  },
  {
    message: "Your love colors my world in the most beautiful shades 🎨",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=500",
    isActive: true,
  },
  {
    message: "With you, every season feels like spring 🌸",
    theme: "poetic",
    imageUrl:
      "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?w=500",
    isActive: true,
  },
  {
    message: "You're the missing piece that makes my life complete 🧩❤️",
    theme: "romantic",
    imageUrl:
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500",
    isActive: true,
  },
  {
    message: "In the garden of love, you're my favorite flower 🌹",
    theme: "poetic",
    imageUrl:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500",
    isActive: true,
  },
  {
    message: "Your love is the poetry my heart sings every day 📝💖",
    theme: "poetic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739477009/tbp_files/z9zhmzakkwu7wuyp7szq.jpg",
    isActive: true,
  },
  {
    message: "Like a fine wine, our love gets better with time 🍷✨",
    theme: "elegant",
    imageUrl:
      "https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=500",
    isActive: true,
  },
  {
    message: "You're the first thing I think of each morning 🌅",
    theme: "romantic",
    imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=500",
    isActive: true,
  },
  {
    message: "Our love story is my favorite fairytale 👑💫",
    theme: "elegant",
    imageUrl:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500",
    isActive: true,
  },
  {
    message: "With you, every moment feels like magic ✨💝",
    theme: "romantic",
    imageUrl:
      "https://res.cloudinary.com/docfy0nxa/image/upload/v1739477009/tbp_files/btvurv3lddjz4cyvcsyo.jpg",
    isActive: true,
  },
];

const seedTemplates = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Delete existing templates
    await Template.deleteMany({});
    console.log("Deleted existing templates");

    // Insert new templates
    await Template.insertMany(templates);
    console.log("Successfully seeded templates");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding templates:", error);
    process.exit(1);
  }
};

seedTemplates();

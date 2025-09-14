import dotenv from "dotenv";
import mongoose from "mongoose";
import { Gift } from "../models/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const gifts = [
  // ================================
  // TECHNOLOGY GIFTS
  // ================================
  {
    giftId: "tech_001",
    name: "Wireless Bluetooth Headphones",
    category: "technology",
    price: 7387,
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    affiliateLink: "https://amazon.com/wireless-headphones",
    interests: ["technology", "music"],
    occasions: ["birthday", "holiday", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family", "colleague"],
    popularityScore: 85,
    rating: 4.5,
    brand: "TechSound",
  },
  {
    giftId: "tech_002",
    name: "Smart Fitness Watch",
    category: "technology",
    price: 16517,
    description: "Advanced fitness tracking with heart rate monitor and GPS",
    affiliateLink: "https://amazon.com/smart-fitness-watch",
    interests: ["technology", "fitness"],
    occasions: ["birthday", "anniversary"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["partner", "friend"],
    popularityScore: 90,
    rating: 4.7,
    brand: "FitTech",
  },
  {
    giftId: "tech_003",
    name: "Portable Phone Charger",
    category: "technology",
    price: 2075,
    description: "10000mAh power bank with fast charging capability",
    affiliateLink: "https://amazon.com/portable-charger",
    interests: ["technology"],
    occasions: ["thank-you", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["colleague", "friend"],
    popularityScore: 75,
    rating: 4.3,
    brand: "PowerMax",
  },
  {
    giftId: "tech_004",
    name: "Smart Home Speaker",
    category: "technology",
    price: 8217,
    description: "Voice-controlled smart speaker with music streaming",
    affiliateLink: "https://amazon.com/smart-speaker",
    interests: ["technology", "music"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["family", "partner"],
    popularityScore: 87,
    rating: 4.6,
    brand: "SmartHome",
  },
  {
    giftId: "tech_005",
    name: "Wireless Charging Pad",
    category: "technology",
    price: 3320,
    description: "Fast wireless charging pad for smartphones",
    affiliateLink: "https://amazon.com/wireless-charging-pad",
    interests: ["technology"],
    occasions: ["thank-you", "just-because"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["colleague", "friend"],
    popularityScore: 78,
    rating: 4.4,
    brand: "ChargeTech",
  },

  // ================================
  // BOOKS
  // ================================
  {
    giftId: "book_001",
    name: "Bestselling Mystery Novel Set",
    category: "books",
    price: 3735,
    description: "Collection of 3 bestselling mystery novels by acclaimed authors",
    affiliateLink: "https://amazon.com/mystery-novel-set",
    interests: ["books"],
    occasions: ["birthday", "holiday", "thank-you"],
    ageGroups: ["30-45", "45+"],
    relationships: ["family", "friend"],
    popularityScore: 70,
    rating: 4.4,
    brand: "Mystery Masters",
  },
  {
    giftId: "book_002",
    name: "Self-Help Book Collection",
    category: "books",
    price: 3320,
    description: "Inspiring books for personal development",
    affiliateLink: "https://amazon.com/self-help-books",
    interests: ["books"],
    occasions: ["birthday", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "colleague"],
    popularityScore: 72,
    rating: 4.3,
    brand: "Wisdom Press",
  },
  {
    giftId: "book_003",
    name: "Cookbook Collection",
    category: "books",
    price: 4565,
    description: "International cuisine cookbook set",
    affiliateLink: "https://amazon.com/cookbook-collection",
    interests: ["books", "cooking"],
    occasions: ["holiday", "anniversary"],
    ageGroups: ["30-45", "45+"],
    relationships: ["family", "partner"],
    popularityScore: 68,
    rating: 4.2,
    brand: "CulinaryBooks",
  },
  {
    giftId: "book_004",
    name: "Science Fiction Anthology",
    category: "books",
    price: 2905,
    description: "Award-winning science fiction stories",
    affiliateLink: "https://amazon.com/sci-fi-anthology",
    interests: ["books"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 74,
    rating: 4.5,
    brand: "SciFi Press",
  },
  {
    giftId: "book_005",
    name: "Art History Coffee Table Book",
    category: "books",
    price: 5810,
    description: "Beautiful visual guide to world art history",
    affiliateLink: "https://amazon.com/art-history-book",
    interests: ["books", "art"],
    occasions: ["holiday", "anniversary"],
    ageGroups: ["30-45", "45+"],
    relationships: ["family", "partner"],
    popularityScore: 69,
    rating: 4.6,
    brand: "Art Publishers",
  },

  // ================================
  // FITNESS GIFTS
  // ================================
  {
    giftId: "fitness_001",
    name: "Yoga Mat with Carrying Strap",
    category: "fitness",
    price: 2905,
    description: "Premium non-slip yoga mat with alignment guides",
    affiliateLink: "https://amazon.com/yoga-mat",
    interests: ["fitness"],
    occasions: ["birthday", "just-because"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "partner"],
    popularityScore: 80,
    rating: 4.6,
    brand: "ZenFit",
  },
  {
    giftId: "fitness_002",
    name: "Resistance Bands Set",
    category: "fitness",
    price: 2407,
    description: "Complete home workout resistance bands kit",
    affiliateLink: "https://amazon.com/resistance-bands",
    interests: ["fitness"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family"],
    popularityScore: 78,
    rating: 4.4,
    brand: "FitBand",
  },
  {
    giftId: "fitness_003",
    name: "Water Bottle with Time Markings",
    category: "fitness",
    price: 1660,
    description: "Motivational water bottle with hourly intake markers",
    affiliateLink: "https://amazon.com/time-marked-water-bottle",
    interests: ["fitness"],
    occasions: ["thank-you", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "colleague"],
    popularityScore: 82,
    rating: 4.3,
    brand: "HydroFit",
  },
  {
    giftId: "fitness_004",
    name: "Foam Roller for Muscle Recovery",
    category: "fitness",
    price: 3735,
    description: "High-density foam roller for post-workout recovery",
    affiliateLink: "https://amazon.com/foam-roller",
    interests: ["fitness"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "partner"],
    popularityScore: 76,
    rating: 4.5,
    brand: "RecoveryPro",
  },
  {
    giftId: "fitness_005",
    name: "Jump Rope with Counter",
    category: "fitness",
    price: 2075,
    description: "Professional jump rope with digital counter",
    affiliateLink: "https://amazon.com/jump-rope-counter",
    interests: ["fitness"],
    occasions: ["birthday", "just-because"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 73,
    rating: 4.2,
    brand: "CardioMax",
  },

  // ================================
  // ART SUPPLIES
  // ================================
  {
    giftId: "art_001",
    name: "Professional Drawing Set",
    category: "art",
    price: 5395,
    description: "Complete set with pencils, charcoal, and sketchbook",
    affiliateLink: "https://amazon.com/drawing-set",
    interests: ["art"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["under-18", "18-30", "30-45"],
    relationships: ["family", "friend"],
    popularityScore: 75,
    rating: 4.5,
    brand: "ArtMaster",
  },
  {
    giftId: "art_002",
    name: "Watercolor Paint Set",
    category: "art",
    price: 6640,
    description: "Professional watercolor painting kit with brushes",
    affiliateLink: "https://amazon.com/watercolor-set",
    interests: ["art"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["family", "friend"],
    popularityScore: 77,
    rating: 4.6,
    brand: "ColorPro",
  },
  {
    giftId: "art_003",
    name: "Digital Drawing Tablet",
    category: "art",
    price: 20745,
    description: "Professional digital art tablet with pressure sensitivity",
    affiliateLink: "https://amazon.com/drawing-tablet",
    interests: ["art", "technology"],
    occasions: ["birthday", "anniversary", "holiday"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["family", "partner"],
    popularityScore: 89,
    rating: 4.8,
    brand: "DigiArt",
  },
  {
    giftId: "art_004",
    name: "Canvas and Easel Set",
    category: "art",
    price: 8300,
    description: "Portable easel with assorted canvas sizes",
    affiliateLink: "https://amazon.com/canvas-easel-set",
    interests: ["art"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["family", "friend"],
    popularityScore: 72,
    rating: 4.4,
    brand: "StudioPro",
  },
  {
    giftId: "art_005",
    name: "Calligraphy Pen Set",
    category: "art",
    price: 4150,
    description: "Traditional calligraphy pens with ink and practice sheets",
    affiliateLink: "https://amazon.com/calligraphy-set",
    interests: ["art"],
    occasions: ["thank-you", "birthday"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "colleague"],
    popularityScore: 68,
    rating: 4.3,
    brand: "InkMaster",
  },

  // ================================
  // MUSIC GIFTS
  // ================================
  {
    giftId: "music_001",
    name: "Bluetooth Portable Speaker",
    category: "music",
    price: 4565,
    description: "Waterproof speaker with 360-degree sound",
    affiliateLink: "https://amazon.com/bluetooth-speaker",
    interests: ["music", "technology"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 85,
    rating: 4.4,
    brand: "SoundWave",
  },
  {
    giftId: "music_002",
    name: "Ukulele for Beginners",
    category: "music",
    price: 8300,
    description: "Beginner-friendly ukulele with instructional book",
    affiliateLink: "https://amazon.com/beginner-ukulele",
    interests: ["music"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["under-18", "18-30", "30-45"],
    relationships: ["family", "friend"],
    popularityScore: 79,
    rating: 4.5,
    brand: "StrumEasy",
  },
  {
    giftId: "music_003",
    name: "Vinyl Record Collection",
    category: "music",
    price: 7470,
    description: "Classic rock vinyl records collection",
    affiliateLink: "https://amazon.com/vinyl-collection",
    interests: ["music"],
    occasions: ["birthday", "anniversary"],
    ageGroups: ["30-45", "45+"],
    relationships: ["partner", "family"],
    popularityScore: 83,
    rating: 4.7,
    brand: "VinylVault",
  },
  {
    giftId: "music_004",
    name: "Wireless Earbuds",
    category: "music",
    price: 12450,
    description: "Premium wireless earbuds with noise cancellation",
    affiliateLink: "https://amazon.com/wireless-earbuds",
    interests: ["music", "technology"],
    occasions: ["birthday", "thank-you", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family", "colleague"],
    popularityScore: 91,
    rating: 4.6,
    brand: "AudioTech",
  },
  {
    giftId: "music_005",
    name: "Music Streaming Gift Card",
    category: "digital",
    price: 2490,
    description: "3-month premium music streaming subscription",
    affiliateLink: "https://spotify.com/premium",
    interests: ["music"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["under-18", "18-30", "30-45"],
    relationships: ["friend", "family"],
    popularityScore: 88,
    rating: 4.7,
    isEmergencyGift: true,
    brand: "Spotify",
  },

  // ================================
  // COOKING GIFTS
  // ================================
  {
    giftId: "cook_001",
    name: "Premium Chef Knife Set",
    category: "cooking",
    price: 9960,
    description: "Professional-grade knife set with wooden block",
    affiliateLink: "https://amazon.com/chef-knife-set",
    interests: ["cooking"],
    occasions: ["anniversary", "holiday"],
    ageGroups: ["30-45", "45+"],
    relationships: ["partner", "family"],
    popularityScore: 88,
    rating: 4.8,
    brand: "ChefPro",
  },
  {
    giftId: "cook_002",
    name: "Gourmet Spice Collection",
    category: "cooking",
    price: 4980,
    description: "Premium spices from around the world",
    affiliateLink: "https://amazon.com/spice-collection",
    interests: ["cooking"],
    occasions: ["holiday", "thank-you"],
    ageGroups: ["30-45", "45+"],
    relationships: ["family", "partner"],
    popularityScore: 73,
    rating: 4.5,
    brand: "SpiceWorld",
  },
  {
    giftId: "cook_003",
    name: "Cast Iron Cookware Set",
    category: "cooking",
    price: 12450,
    description: "Seasoned cast iron skillet and dutch oven set",
    affiliateLink: "https://amazon.com/cast-iron-set",
    interests: ["cooking"],
    occasions: ["anniversary", "holiday"],
    ageGroups: ["30-45", "45+"],
    relationships: ["partner", "family"],
    popularityScore: 85,
    rating: 4.7,
    brand: "IronCraft",
  },
  {
    giftId: "cook_004",
    name: "Coffee Bean Grinder",    
    category: "cooking",
    price: 6225,
    description: "Burr coffee grinder for freshly ground beans",
    affiliateLink: "https://amazon.com/coffee-grinder",
    interests: ["cooking"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family", "colleague"],
    popularityScore: 81,
    rating: 4.4,
    brand: "BrewMaster",
  },
  {
    giftId: "cook_005",
    name: "Silicone Baking Set",
    category: "cooking",
    price: 3735,
    description: "Non-stick silicone baking molds and utensils",
    affiliateLink: "https://amazon.com/silicone-baking-set",
    interests: ["cooking"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family"],
    popularityScore: 76,
    rating: 4.3,
    brand: "BakeEasy",
  },

  // ================================
  // GAMING GIFTS
  // ================================
  {
    giftId: "game_001",
    name: "Wireless Gaming Controller",
    category: "gaming",
    price: 5810,
    description: "Professional wireless controller with custom buttons",
    affiliateLink: "https://amazon.com/wireless-controller",
    interests: ["gaming", "technology"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["under-18", "18-30", "30-45"],
    relationships: ["friend", "family"],
    popularityScore: 87,
    rating: 4.6,
    brand: "GamePro",
  },
  {
    giftId: "game_002",
    name: "Gaming Headset",
    category: "gaming",
    price: 12450,
    description: "Surround sound gaming headset with microphone",
    affiliateLink: "https://amazon.com/gaming-headset",
    interests: ["gaming", "technology"],
    occasions: ["birthday", "holiday"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "family"],
    popularityScore: 89,
    rating: 4.7,
    brand: "AudioGame",
  },
  {
    giftId: "game_003",
    name: "Gaming Keyboard",
    category: "gaming",
    price: 9960,
    description: "Mechanical RGB gaming keyboard",
    affiliateLink: "https://amazon.com/gaming-keyboard",
    interests: ["gaming", "technology"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 84,
    rating: 4.5,
    brand: "KeyMaster",
  },
  {
    giftId: "game_004",
    name: "Gaming Mouse with RGB",
    category: "gaming",
    price: 6640,
    description: "High-precision gaming mouse with customizable RGB lighting",
    affiliateLink: "https://amazon.com/gaming-mouse",
    interests: ["gaming", "technology"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 82,
    rating: 4.4,
    brand: "MouseTech",
  },
  {
    giftId: "game_005",
    name: "Gaming Gift Card",
    category: "digital",
    price: 4150,
    description: "Digital game store gift card",
    affiliateLink: "https://store.steampowered.com/digitalgiftcards",
    interests: ["gaming"],
    occasions: ["birthday", "thank-you", "just-because"],
    ageGroups: ["under-18", "18-30", "30-45"],
    relationships: ["friend", "family"],
    popularityScore: 93,
    rating: 4.8,
    isEmergencyGift: true,
    brand: "Steam",
  },

  // ================================
  // FASHION GIFTS
  // ================================
  {
    giftId: "fashion_001",
    name: "Designer Handbag",
    category: "fashion",
    price: 24900,
    description: "Luxury designer handbag with premium materials",
    affiliateLink: "https://amazon.com/designer-handbag",
    interests: ["fashion"],
    occasions: ["birthday", "anniversary", "holiday"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["partner", "family"],
    popularityScore: 86,
    rating: 4.6,
    brand: "LuxeFashion",
  },
  {
    giftId: "fashion_002",
    name: "Luxury Watch",
    category: "fashion",
    price: 49800,
    description: "Premium timepiece with leather strap",
    affiliateLink: "https://amazon.com/luxury-watch",
    interests: ["fashion"],
    occasions: ["anniversary", "birthday"],
    ageGroups: ["30-45", "45+"],
    relationships: ["partner", "family"],
    popularityScore: 91,
    rating: 4.8,
    brand: "TimeElite",
  },
  {
    giftId: "fashion_003",
    name: "Silk Scarf Collection",
    category: "fashion",
    price: 8300,
    description: "Set of 3 premium silk scarves in various patterns",
    affiliateLink: "https://amazon.com/silk-scarves",
    interests: ["fashion"],
    occasions: ["birthday", "thank-you", "holiday"],
    ageGroups: ["30-45", "45+"],
    relationships: ["family", "friend"],
    popularityScore: 74,
    rating: 4.3,
    brand: "SilkStyle",
  },
  {
    giftId: "fashion_004",
    name: "Designer Sunglasses",
    category: "fashion",
    price: 14940,
    description: "Premium designer sunglasses with UV protection",
    affiliateLink: "https://amazon.com/designer-sunglasses",
    interests: ["fashion"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "partner"],
    popularityScore: 78,
    rating: 4.4,
    brand: "SunStyle",
  },
  {
    giftId: "fashion_005",
    name: "Jewelry Box Organizer",
    category: "fashion",
    price: 6225,
    description: "Elegant jewelry storage box with multiple compartments",
    affiliateLink: "https://amazon.com/jewelry-box",
    interests: ["fashion"],
    occasions: ["birthday", "thank-you"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "family"],
    popularityScore: 72,
    rating: 4.2,
    brand: "OrganizeIt",
  },

  // ================================
  // EMERGENCY/DIGITAL GIFTS
  // ================================
  {
    giftId: "emergency_001",
    name: "Amazon Gift Card",
    category: "digital",
    price: 4150,
    description: "Digital Amazon gift card - instant delivery",
    affiliateLink: "https://amazon.com/gift-cards",
    interests: ["technology"],
    occasions: ["birthday", "thank-you", "just-because"],
    ageGroups: ["under-18", "18-30", "30-45", "45+"],
    relationships: ["family", "friend", "colleague", "partner"],
    popularityScore: 95,
    rating: 4.9,
    isEmergencyGift: true,
    brand: "Amazon",
  },
  {
    giftId: "emergency_002",
    name: "Netflix Gift Card",
    category: "digital",
    price: 2075,
    description: "Digital Netflix gift card for entertainment",
    affiliateLink: "https://netflix.com/gift",
    interests: ["technology"],
    occasions: ["thank-you", "just-because"],
    ageGroups: ["18-30", "30-45", "45+"],
    relationships: ["friend", "colleague"],
    popularityScore: 88,
    rating: 4.7,
    isEmergencyGift: true,
    brand: "Netflix",
  },
  {
    giftId: "emergency_003",
    name: "Uber Eats Gift Card",
    category: "digital",
    price: 2490,
    description: "Food delivery gift card for convenience",
    affiliateLink: "https://ubereats.com/gift",
    interests: ["cooking"],
    occasions: ["thank-you", "just-because"],
    ageGroups: ["18-30", "30-45"],
    relationships: ["friend", "colleague"],
    popularityScore: 85,
    rating: 4.5,
    isEmergencyGift: true,
    brand: "Uber",
  }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGODB_URI environment variable is not set. Please check your .env file."
      );
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    console.log(
      "URI (masked):",
      mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//****:****@")
    );

    // MongoDB Atlas optimized connection options
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,
      retryWrites: true,
    };

    await mongoose.connect(mongoURI, connectionOptions);

    console.log("✅ Connected to MongoDB Atlas");
    console.log(`🌐 Database: ${mongoose.connection.name}`);

    // Check if gifts already exist
    const existingGiftCount = await Gift.countDocuments();
    console.log(`📊 Existing gifts in database: ${existingGiftCount}`);

    // Clear existing gifts
    await Gift.deleteMany({});
    console.log("🧹 Cleared existing gifts");

    // Insert new gifts
    console.log(`📦 Inserting ${gifts.length} gifts...`);
    await Gift.insertMany(gifts);
    console.log(
      `✅ Successfully inserted ${gifts.length} gifts into the database`
    );

    // Verify insertion
    const finalCount = await Gift.countDocuments();
    console.log(`🔢 Total gifts in database after seeding: ${finalCount}`);

    // Log some statistics
    const regularGifts = gifts.filter((g) => !g.isEmergencyGift).length;
    const emergencyGifts = gifts.filter((g) => g.isEmergencyGift).length;
    console.log(
      `📊 Regular gifts: ${regularGifts}, Emergency gifts: ${emergencyGifts}`
    );

    const categories = [...new Set(gifts.map((g) => g.category))];
    console.log(`🏷️  Categories: ${categories.join(", ")}`);

    const priceRange = {
      min: Math.min(...gifts.map((g) => g.price)),
      max: Math.max(...gifts.map((g) => g.price)),
    };
    console.log(`💰 Price range: ₹${priceRange.min} - ₹${priceRange.max}`);

    console.log("🎉 Database seeded successfully!");

    // Close connection
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.error(
      "💡 Make sure your MongoDB Atlas credentials are correct in .env file"
    );
    process.exit(1);
  }
};

seedDatabase();
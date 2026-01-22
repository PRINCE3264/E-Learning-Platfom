


import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import Razorpay from "razorpay";
import { connectDb } from "./database/db.js"; 
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quiz.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config(); // Load .env variables

// ✅ Check Razorpay keys
if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  console.error("❌ Razorpay keys are missing. Check your .env file.");
  process.exit(1);
}

// ✅ Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const app = express();

// ✅ CORS middleware MUST come BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173",   // your React app URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // allow Authorization header
    credentials: true,                   // if using cookies
  })
);
app.use(bodyParser.json());

// ✅ Routes
app.use("/api/contact", contactRoutes);

// Middlewares

app.use(cors());
app.use("/uploads", express.static("uploads")); // Static files

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

// ✅ Razorpay checkout route
app.post("/api/checkout", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: Number(amount) * 100, // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY, // send key to frontend
    });
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// ✅ API Routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api/quiz", quizRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  connectDb();
});



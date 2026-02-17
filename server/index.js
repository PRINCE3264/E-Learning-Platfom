


// import express from "express";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import cors from "cors";
// import Razorpay from "razorpay";
// import { connectDb } from "./database/db.js";
// import userRoutes from "./routes/user.js";
// import courseRoutes from "./routes/course.js";
// import adminRoutes from "./routes/admin.js";
// import quizRoutes from "./routes/quiz.js";
// import contactRoutes from "./routes/contactRoutes.js";
// import instructorRoutes from "./routes/instructor.js";
// import analyticsRoutes from "./routes/analytics.js";
// import StudyMaterial from "./models/StudyMaterial.js";
// dotenv.config(); // Load .env variables

// // ✅ Check Razorpay keys
// if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
//   console.error("❌ Razorpay keys are missing. Check your .env file.");
//   process.exit(1);
// }

// // ✅ Razorpay instance
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// const app = express();


// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));


// // ✅ CORS middleware MUST come BEFORE routes
// app.use(
//   cors({
//     origin: "http://localhost:5173",   // your React app URL
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"], // allow Authorization header
//     credentials: true,                   // if using cookies
//   })
// );
// app.use(express.json()); // Changed from bodyParser.json()
// app.use(express.urlencoded({ extended: true })); // Added urlencoded

// // ✅ Routes
// app.use("/api/contact", contactRoutes);

// // Middlewares

// // app.use(cors()); // Removed duplicate cors()
// app.use("/uploads", express.static("uploads")); // Static files

// // ✅ Test route
// app.get("/", (req, res) => {
//   res.send("Server is working 🚀");
// });

// // ✅ Razorpay checkout route
// app.post("/api/checkout", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ message: "Amount is required" });
//     }

//     const options = {
//       amount: Number(amount) * 100, // INR → paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//       key: process.env.RAZORPAY_KEY, // send key to frontend
//     });
//   } catch (error) {
//     console.error("❌ Razorpay order error:", error);
//     res.status(500).json({ message: "Error creating order" });
//   }
// });

// import commentRoutes from "./routes/comment.js";

// // ...

// // ✅ API Routes
// app.use("/api", userRoutes);
// app.use("/api", courseRoutes);
// app.use("/api", adminRoutes);
// app.use("/api/quiz", quizRoutes);
// app.use("/api", commentRoutes);
// app.use("/api", instructorRoutes);
// app.use("/api", analyticsRoutes);
// app.use("/api/materials", require("./routes/materialRoutes"));
// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
//   connectDb();
// });



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";

import { connectDb } from "./database/db.js";

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import quizRoutes from "./routes/quiz.js";
import contactRoutes from "./routes/contactRoutes.js";
import instructorRoutes from "./routes/instructor.js";
import analyticsRoutes from "./routes/analytics.js";
import commentRoutes from "./routes/comment.js";
import materialRoutes from "./routes/materialRoutes.js"; // ✅ FIXED ES MODULE

dotenv.config();

const app = express();

/* =========================
   Middleware (ONLY ONCE)
========================= */

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* =========================
   Razorpay Setup
========================= */

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  console.error("❌ Razorpay keys missing in .env");
  process.exit(1);
}

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

/* =========================
   Routes
========================= */

app.get("/", (req, res) => {
  res.send("Server running successfully 🚀");
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ message: "Amount required" });

    const order = await instance.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY
    });

  } catch (error) {
    res.status(500).json({ message: "Payment order failed" });
  }
});

/* =========================
   API ROUTES
========================= */

app.use("/api/contact", contactRoutes);
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api", commentRoutes);
app.use("/api", instructorRoutes);
app.use("/api", analyticsRoutes);
app.use("/api/materials", materialRoutes); // ✅ STUDY MATERIAL CRUD

/* =========================
   Server Start
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDb();
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


import mongoose from "mongoose";
import { User } from "./models/User.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

// Config
const DB_URI = "mongodb://localhost:27017/elearning";
const JWT_SECRET = "mysupersecretkey12345";
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

const run = async () => {
    try {
        console.log("🔵 Connecting to DB...");
        await mongoose.connect(DB_URI);
        console.log("✅ DB Connected");

        const testEmail = "api_test_final@example.com";
        await User.deleteOne({ email: testEmail });

        const user = await User.create({
            name: "API Tester",
            email: testEmail,
            password: "hashedpassword123",
        });
        console.log("✅ Test User CreatedID:", user._id);

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "10m" });
        console.log("✅ Token Generated");

        console.log("🔵 Testing PUT /api/user/update...");
        const updatePayload = {
            name: "Updated API Tester",
            phone: "9998887776",
        };

        // FIX: Using Authorization: Bearer <token>
        const response = await fetch(`${BASE_URL}/api/user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatePayload)
        });

        const data = await response.json();

        console.log("✅ Response Status:", response.status);
        if (response.status === 200) {
            console.log("🎉 SUCCESS:", data.message);
        } else {
            console.error("❌ FAILURE:", data);
        }

        await User.deleteOne({ _id: user._id });

    } catch (error) {
        console.error("❌ Test Failed:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();

import dotenv from "dotenv";
import { sendForgotMail } from "./middlewares/sendMail.js";

dotenv.config();

const testForgotPassword = async () => {
  console.log("Testing sendForgotMail...");
  try {
    // We'll just test that it doesn't throw a runtime error due to parameter mismatch
    // Note: This will actually try to send an email if .env is correct.
    // If we want to avoid sending, we could mock transport in sendMail.js but let's see.
    
    const email = "test@example.com";
    const subject = "Test Reset Password";
    const data = { email: "test@example.com", token: "mocktoken123" };
    
    console.log("Calling sendForgotMail with:", { email, subject, data });
    
    // Using await here. If it works, we're good. If it fails with "to" is missing, we'll know.
    // We expect it to fail with actual transport error if credentials are bad, 
    // but the logic error (to: undefined) should be gone.
    
    await sendForgotMail(email, subject, data);
    console.log("✅ sendForgotMail call succeeded (logic-wise)");
  } catch (error) {
    console.error("❌ sendForgotMail failed:", error.message);
    if (error.message.includes("No recipients defined")) {
       console.error("Logic error persists: No recipients defined");
    }
  }
};

testForgotPassword();

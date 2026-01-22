

import twilio from "twilio";
import dotenv from "dotenv";
import Contact from "../models/Contact.js";

dotenv.config();

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const createContact = async (req, res) => {
  const { name, email, course, state, domain, address, message } = req.body;

  // ✅ Validate required fields
  if (!name || !email || !course || !state || !domain || !address || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // ✅ Save to database (optional)
    const contact = new Contact({ name, email, course, state, domain, address, message });
    await contact.save();

    // ✅ WhatsApp message content
    const textMessage = `
📌 New Contact Request:
👤 Name: ${name}
📧 Email: ${email}
🎓 Course: ${course}
🏙 State: ${state}
💻 Domain: ${domain}
🏠 Address: ${address}
📝 Message: ${message}
    `;

    // ✅ Send WhatsApp message via Twilio Sandbox
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,   // Must be Twilio Sandbox number: whatsapp:+14155238886
      to: process.env.ADMIN_WHATSAPP_NUMBER,      // Must be joined to Sandbox: whatsapp:+919508604795
      body: textMessage,
    });

    res.status(200).json({ success: true, sid: response.sid, contact });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ error: "Failed to create contact" });
  }
};




// import twilio from "twilio";
// import dotenv from "dotenv";
// import Contact from "../models/Contact.js";

// dotenv.config();

// // Initialize Twilio client
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// // Create a new contact
// export const createContact = async (req, res) => {
//   const { name, email, course, state, domain, address, message } = req.body;

//   if (!name || !email || !course || !state || !domain || !address || !message) {
//     return res.status(400).json({ error: "All fields are required!" });
//   }

//   try {
//     const contact = new Contact({ name, email, course, state, domain, address, message });
//     await contact.save();

//     const textMessage = `
// 📌 New Contact Request:
// 👤 Name: ${name}
// 📧 Email: ${email}
// 🎓 Course: ${course}
// 🏙 State: ${state}
// 💻 Domain: ${domain}
// 🏠 Address: ${address}
// 📝 Message: ${message}
//     `;

//     await client.messages.create({
//       from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio sandbox number
//       to: process.env.ADMIN_WHATSAPP_NUMBER,    // Admin number
//       body: textMessage,
//     });

//     res.status(200).json({ success: true, contact });
//   } catch (error) {
//     console.error("Twilio Error:", error);
//     res.status(500).json({ error: "Failed to create contact" });
//   }
// };

// // ✅ Admin: get all contacts
// export const getContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, contacts });
//   } catch (error) {
//     console.error("GetContacts Error:", error);
//     res.status(500).json({ error: "Failed to fetch contacts" });
//   }
// };

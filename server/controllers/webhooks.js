import { Webhook } from "svix";
import User from "../models/users.js";
import express from "express";

const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // Raw body string (see middleware below)
    const headers = req.headers;

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify the event
    const event = wh.verify(payload, {
      "svix-id": headers["svix-id"],
      "svix-timestamp": headers["svix-timestamp"],
      "svix-signature": headers["svix-signature"],
    });

    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        break;
      }

      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        console.log(`Unhandled Clerk webhook event: ${type}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;

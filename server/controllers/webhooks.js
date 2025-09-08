import { Webhook } from "svix";
import User from "../models/users.js";

const clerkWebhooks = async (req, res) => {
  // 1. Log that the function was entered
  console.log("Clerk webhook handler initiated...");

  try {
    const payload = req.body;
    const headers = req.headers;

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      evt = whook.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });
    } catch (err) {
      console.error("Error verifying webhook:", err.message);
      return res
        .status(400)
        .json({ success: false, message: "Webhook verification failed" });
    }

    const { data } = evt;
    const eventType = evt.type;

    // 2. Log the event type and data received
    console.log(`Received verified event: ${eventType}`);
    console.log("Event data:", JSON.stringify(data, null, 2));

    switch (eventType) {
      case "user.created": {
        // Check if user already exists to prevent duplicate errors
        const existingUser = await User.findById(data.id);
        if (existingUser) {
          console.log("User already exists in DB:", data.id);
          break;
        }

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
          resume: "",
        };

        // 3. Log the object you are about to save
        console.log("Attempting to create user with data:", userData);
        await User.create(userData);
        console.log("User successfully created in DB:", data.id);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          image: data.image_url,
        };
        console.log("Attempting to update user with data:", userData);
        await User.findByIdAndUpdate(data.id, userData);
        console.log("User successfully updated in DB:", data.id);
        break;
      }

      case "user.deleted": {
        if (data.id) {
          console.log("Attempting to delete user:", data.id);
          await User.findByIdAndDelete(data.id);
          console.log("User successfully deleted from DB:", data.id);
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }

    res
      .status(200)
      .json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    // 4. Log the FULL error object, not just the message
    console.error("!!! Critical error processing webhook:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default clerkWebhooks;

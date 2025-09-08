import { Webhook } from "svix";
import User from "../models/users.js";

// --- Event Handler Functions ---

/**
 * Handles the 'user.created' event from Clerk.
 * @param {object} data - The event data payload from the webhook.
 */
async function handleUserCreated(data) {
  // Check if user already exists to prevent duplicate errors
  const existingUser = await User.findById(data.id);
  if (existingUser) {
    console.log("User already exists in DB:", data.id);
    return;
  }

  const userData = {
    _id: data.id,
    email: data.email_addresses[0].email_address,
    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
    image: data.image_url,
    resume: "",
  };

  console.log("Attempting to create user with data:", userData);
  await User.create(userData);
  console.log("User successfully created in DB:", data.id);
}

/**
 * Handles the 'user.updated' event from Clerk.
 * @param {object} data - The event data payload from the webhook.
 */
async function handleUserUpdated(data) {
  const userData = {
    email: data.email_addresses[0].email_address,
    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
    image: data.image_url,
  };

  console.log("Attempting to update user with data:", userData);
  await User.findByIdAndUpdate(data.id, userData);
  console.log("User successfully updated in DB:", data.id);
}

/**
 * Handles the 'user.deleted' event from Clerk.
 * @param {object} data - The event data payload from the webhook.
 */
async function handleUserDeleted(data) {
  if (!data.id) {
    console.log("Delete event received without a user ID. Skipping.");
    return;
  }
  console.log("Attempting to delete user:", data.id);
  await User.findByIdAndDelete(data.id);
  console.log("User successfully deleted from DB:", data.id);
}


// --- Main Webhook Controller ---

const clerkWebhooks = async (req, res) => {
  console.log("Clerk webhook handler initiated...");
  try {
    // DEBUGGING STEP: Log all incoming headers to diagnose the "Missing required headers" error.
    console.log("Incoming Headers:", JSON.stringify(req.headers, null, 2));

    const payload = req.body;
    const headers = req.headers;
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      // Verify the webhook signature
      evt = whook.verify(payload, {
        "svix-id": headers["svix-id"],
        "svix-timestamp": headers["svix-timestamp"],
        "svix-signature": headers["svix-signature"],
      });
    } catch (err) {
      console.error("Error verifying webhook:", err.message);
      return res.status(400).json({ success: false, message: "Webhook verification failed" });
    }

    const { data } = evt;
    const eventType = evt.type;

    console.log(`Received verified event: ${eventType}`);
    console.log("Event data:", JSON.stringify(data, null, 2));

    // Route the event to the appropriate handler
    switch (eventType) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("!!! Critical error processing webhook:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default clerkWebhooks;

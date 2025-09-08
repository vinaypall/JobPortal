import { Webhook } from "svix";
import User from "../models/users.js";
import { json } from "express";

// Api controller function to manage clerk user with database
const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instace with clear webhook secret;
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.header["svix-id"],
      "svix-timestamp": req.header["svix-timestamp"],
      "svix-signature": req.header["svix-signature"],
    });
    // Getting data from req body
    const { data, type } = req.type;

    //Switch cases for differt event
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ sucess: false, message: "Webhook " });
  }
};

export default clerkWebhooks;

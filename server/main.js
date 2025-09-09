import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import "./config/instrument.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();

//Middlewares
app.use(cors());
app.post("/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json());

//connect to database
await connectDB();
await connectCloudinary();
//Other Routes
app.get("/", (req, res) => res.send("API working"));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use("/api/company", companyRoutes);
// Sentry error handler (must be after all controllers)
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

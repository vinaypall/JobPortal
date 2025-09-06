import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes

app.get("/", (req, res) => res.send("API working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

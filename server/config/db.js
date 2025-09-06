import mongoose from "mongoose";

//function to connect to MonggoDB with database

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });
  await mongoose.connect(`${process.env.MONOGODB_URI}/job-portal`);
};

export default connectDB;

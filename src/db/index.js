import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      "Db connected successfully",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("database connection failed", error.message);
  }
};

export { connectDB };

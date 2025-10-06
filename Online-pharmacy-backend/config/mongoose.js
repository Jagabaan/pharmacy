import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load env variables

const password = process.env.MONGODB_PASSWORD;

export async function mongoDbConnect() {
  try {
    await mongoose.connect(
      `mongodb+srv://yunusamuhammad02019:${password}@jagaban-db.shqm30x.mongodb.net/`
    );
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log({
      error: "error occurred",
      message: error.message,
      action: "try again",
    });
  }

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
}

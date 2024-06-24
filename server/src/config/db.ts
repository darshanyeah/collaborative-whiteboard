import mongoose from "mongoose";

/**
 * ### Connects to the MongoDB database using the provided MONGO_URI and DATABASE_NAME environment variables.
 *
 * @return {Promise<void>} A promise that resolves when the connection is successful, or rejects with an error if the connection fails.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      dbName: process.env.DATABASE_NAME,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

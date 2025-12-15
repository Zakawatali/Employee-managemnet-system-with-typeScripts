import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown connection error";
    console.error(`❌ MongoDB connection error: ${message}`);
    process.exit(1);
  }
};

export default connectDB;

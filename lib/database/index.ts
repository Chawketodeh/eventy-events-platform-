import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null }; //ensures reuse between hot reloads.

export const connectToDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(" MONGODB_URI is not defined");
  }

  if (cached.conn) {
    return cached.conn;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: "eventy",
        serverSelectionTimeoutMS: 5000, // wait max 5s for connection /avoids long timeouts
      });
    }

    cached.conn = await cached.promise;
    (global as any).mongoose = cached;
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // STOP everything if DB is not connected
  }
};

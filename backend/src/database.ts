import mongoose from "mongoose";
import { configEnv } from "./config/index";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    console.log("USE MEMORY DB:", configEnv.db.memory_db);

    if (configEnv.db.memory_db) {
      console.log("⚡ Trying in-memory MongoDB...");

      let mongoModule: any = null;

      try {
        mongoModule = require("mongodb-memory-server");
      } catch {
        mongoModule = null;
      }

      if (mongoModule?.MongoMemoryServer) {
        const mongod = await mongoModule.MongoMemoryServer.create();
        await mongoose.connect(mongod.getUri());
        console.log("✅ Connected to in-memory MongoDB");
      } else {
        console.warn(
          "⚠️ mongodb-memory-server not installed, 👉 Run: npm install mongodb-memory-server",
        );
        console.warn("⚠️ Falling back to local MongoDB");
        await mongoose.connect(configEnv.db.connection_string);
        console.log("✅ Connected to MongoDB (fallback)");
      }
    } else {
      await mongoose.connect(configEnv.db.connection_string);
      console.log("✅ Connected to local MongoDB");
    }

    isConnected = true;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

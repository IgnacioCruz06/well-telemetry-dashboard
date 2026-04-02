import dotenv from "dotenv";
dotenv.config();

export const configEnv = {
  server: {
    port: process.env.SERVER_PORT || 3001,
  },
  db: {
    connection_string: process.env.MONGODB_CONNECTION_STRING || "",
    memory_db: process.env.USE_IN_MEMORY_DB === "true",
    batch_size: Number(process.env.BATCH_SIZE) || 500,
  },
};

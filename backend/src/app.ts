import express from "express";
import cors from "cors";
import telemetryRoutes from "./controllers/v1/TelemetryController";
import { connectDB } from "./database";
import { configEnv } from "./config/index";

const app = express();
const port = configEnv.server.port;

//Middleware to parse incoming requests with urlencoded payloads and is based on body-parser.
//extended property allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
app.use(express.urlencoded({ extended: true }));

//Body parser middleware
app.use(express.json());

app.use(cors());

(async () => {
  try {
    await connectDB();

    app.use("/v1", telemetryRoutes);

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();

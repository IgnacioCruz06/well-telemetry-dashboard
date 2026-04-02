import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },

  time: {
    type: Number,
    required: true,
  },

  curves: {
    type: Object,
    required: true,
  },
});

// 👉 para consultas por fecha (lo más importante)
TelemetrySchema.index({ timestamp: 1 });

// 👉 para consultas por tiempo relativo
TelemetrySchema.index({ time: 1 });

export default mongoose.model("Telemetry", TelemetrySchema);

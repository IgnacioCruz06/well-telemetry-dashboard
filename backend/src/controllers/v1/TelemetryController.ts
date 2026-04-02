import { Router } from "express";
import Telemetry from "../../models/Telemetry";

const router = Router();

router.get("/telemetry/latest", async (req, res) => {
  try {
    const data = await Telemetry.findOne()
      .sort({ timestamp: -1 })
      .select({
        timestamp: 1,
        time: 1,
        "curves.SPPA": 1,
        "curves.MTIA": 1,
      })
      .lean();

    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({
      timestamp: data.timestamp,
      time: data.time,
      pressure: data.curves?.SPPA ?? null,
      temperature_in: data.curves?.MTIA ?? null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});

/**
 * GET /v1/telemetry/range
 * Ej:
 * - Chart:  /range?hours=24&mode=chart
 * - Table:  /range?hours=24&page=1&limit=100
 */
router.get("/telemetry/range", async (req, res) => {
  try {
    // 🔹 params
    let hours = parseInt(req.query.hours as string) || 24;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const mode = (req.query.mode as string) || "table";

    // 🔥 límites seguros
    if (hours < 1) hours = 1;
    if (hours > 24) hours = 24;

    // 🔹 limit solo si es tabla
    const hasLimit = req.query.limit !== undefined && mode !== "chart";

    const limit = hasLimit
      ? Math.min(parseInt(req.query.limit as string), 500)
      : null;

    const skip = limit ? (page - 1) * limit : 0;

    // 🔥 usar última fecha REAL (no Date.now)
    const latest = await Telemetry.findOne()
      .sort({ timestamp: -1 })
      .select({ timestamp: 1 })
      .lean();

    if (!latest) {
      return res.status(404).json({ message: "No data found" });
    }

    const endDate = latest.timestamp;

    const fromDate = new Date(
      new Date(endDate).getTime() - hours * 60 * 60 * 1000,
    );

    const query = {
      timestamp: { $gte: fromDate, $lte: endDate },
    };

    // 🔥 query base
    let mongoQuery = Telemetry.find(query)
      .sort({ timestamp: 1 })
      .select({
        timestamp: 1,
        time: 1,
        curves: 1,
      })
      .lean();

    // 🔥 aplicar paginación SOLO en modo tabla
    if (limit) {
      mongoQuery = mongoQuery.skip(skip).limit(limit);
    }

    // 🔥 ejecución paralela
    const [data, total] = await Promise.all([
      mongoQuery,
      limit ? Telemetry.countDocuments(query) : Promise.resolve(null),
    ]);

    res.json({
      meta: {
        mode,
        hours,
        from: fromDate,
        to: endDate,
        page,
        limit: limit ?? "all",
        total,
        totalPages: limit ? Math.ceil((total || 0) / limit) : 1,
      },
      data,
    });
  } catch (error) {
    console.error("❌ Range endpoint error:", error);
    res.status(500).json({ message: "Internal error" });
  }
});

export default router;

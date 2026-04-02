import fs from "fs";
import readline from "readline";
import Telemetry from "../models/Telemetry";
import { connectDB } from "../database";
import { configEnv } from "../config/index";

export async function importData() {
  try {
    await connectDB();

    console.log("✅ Import data process started");

    const rl = readline.createInterface({
      input: fs.createReadStream("../data/20230512_060000_Quesqui-403.las"),
      crlfDelay: Infinity,
    });

    let isCurveSection = false;
    let isDataSection = false;

    let curves: string[] = [];

    let startDate: Date | null = null;

    // 🔥 WRAP handling
    const LINES_PER_RECORD = 6;

    let depthTime: number | null = null;
    let block: string[] = [];

    // 🔥 PERFORMANCE
    const batch: any[] = [];
    const BATCH_SIZE = configEnv.db.batch_size;

    let counter = 0;

    for await (const line of rl) {
      const trimmed = line.trim();

      // 🔹 EXTRAER FECHA BASE (STRT)
      if (trimmed.startsWith("STRT.S")) {
        const raw = trimmed.substring(trimmed.indexOf(":") + 1).trim();

        const match = raw.match(
          /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})\s+([+-]\d{2}:\d{2})/,
        );

        if (match) {
          const [, year, month, day, hour, minute, offset] = match;
          const isoString = `${year}-${month}-${day}T${hour}:${minute}:00${offset}`;
          const parsedDate = new Date(isoString);

          if (!isNaN(parsedDate.getTime())) {
            startDate = parsedDate;
            console.log("✅ Start date FIXED:", startDate);
          } else {
            console.error("❌ Invalid parsed date:", isoString);
          }
        } else {
          console.error("❌ STRT format not recognized:", raw);
        }
      }

      // 🔹 CURVE SECTION
      if (trimmed.startsWith("~CURVE")) {
        isCurveSection = true;
        continue;
      }

      if (isCurveSection && trimmed.startsWith("~")) {
        isCurveSection = false;
        console.log("✅ Curves detected:", curves.length);
        continue;
      }

      if (isCurveSection && trimmed && !trimmed.startsWith("#")) {
        const curveName = trimmed.split(".")[0].trim();
        curves.push(curveName);
        continue;
      }

      // 🔹 ASCII DATA
      if (trimmed.startsWith("~ASCII")) {
        isDataSection = true;
        continue;
      }

      if (!isDataSection) continue;

      // 🔹 detectar TIME base
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        depthTime = parseFloat(trimmed);
        block = [];
        continue;
      }

      if (depthTime === null) continue;

      // 🔹 acumular bloque WRAP
      block.push(trimmed);

      if (block.length === LINES_PER_RECORD) {
        const values: (number | null)[] = [];

        for (const row of block) {
          const nums = row.split(/\s+/).map((n) => {
            const val = parseFloat(n);
            return isNaN(val) ? null : val;
          });

          values.push(...nums);
        }

        // 🔥 construir record dinámico
        const record: any = {};

        curves.forEach((curve, index) => {
          record[curve] = values[index] ?? null;
        });

        // 🔥 calcular timestamp real
        let timestamp = new Date();
        const timeOffset = depthTime;

        if (startDate && timeOffset !== null) {
          timestamp = new Date(startDate.getTime() + timeOffset * 1000);
        } else {
          // fallback
          timestamp = new Date();
        }

        // 🔥 agregar a batch
        batch.push({
          timestamp,
          time: timeOffset,
          curves: record,
        });

        counter++;

        // 🔥 batch insert
        if (batch.length >= BATCH_SIZE) {
          await Telemetry.insertMany(batch, { ordered: false });
          console.log(
            `🚀 Batch inserted: ${batch.length} - time ${timeOffset}`,
          );
          batch.length = 0;
        }

        // 🔥 log cada 2000
        if (counter % 2000 === 0) {
          console.log(`📊 Processed: ${counter}`);
        }

        // reset
        block = [];
        depthTime = null;
      }
    }

    // 🔥 insertar restante
    if (batch.length > 0) {
      await Telemetry.insertMany(batch, { ordered: false });
      console.log(`🚀 Final batch inserted: ${batch.length}`);
    }

    console.log("✅ Total records processed:", counter);
    console.log("🚀 Import completed");
  } catch (error) {
    console.error("❌ Import error:", error);
  }
}

import { useEffect, useState } from "react";
import Tabs from "./Tabs";
import Sidebar from "./Sidebar";
import ChartPanel from "./ChartPanel";
import CurveSelector from "./CurveSelector";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>(["SPPA", "RPMA"]);
  const [xAxis, setXAxis] = useState<"timestamp" | "time">("timestamp");

  useEffect(() => {
    fetch(
      "http://localhost:3000/v1/telemetry/range?hours=24&mode=chart"
    )
      .then((r) => r.json())
      .then((res) => {
        if (!res.data) return;

        const formatted = res.data.map((item: any) => ({
          ...item.curves,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          time: item.time,
        }));

        setData(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
        }}
      >
        {/* 🔹 HEADER */}
        <div
          style={{
            padding: 20,
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <h1>Well Monitoring Dashboard</h1>

          {/* 🔥 selector */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <div>
              <label style={{ marginRight: 10 }}>X Axis:</label>

              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value as any)}
                style={{
                  padding: 6,
                  borderRadius: 6,
                  background: "#1e293b",
                  color: "white",
                }}
              >
                <option value="timestamp">Timestamp</option>
                <option value="time">Time (seconds)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🔹 CONTENIDO */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 20px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Tabs
            tabs={[
              {
                label: "Custom View",
                content: (
                  <>
                    <CurveSelector
                      curves={Object.keys(data[0] || {})}
                      selected={selected}
                      onChange={setSelected}
                    />

                    <ChartPanel
                      title="Custom Chart"
                      data={data}
                      curves={selected}
                      xAxis={xAxis}
                    />
                  </>
                ),
              },
              {
                label: "Operational View",
                content: (
                  <div className="charts-grid">
                    <ChartPanel
                      title="Pressure"
                      data={data}
                      curves={["SPPA", "MBPA"]}
                      xAxis={xAxis}
                    />

                    <ChartPanel
                      title="Drilling"
                      data={data}
                      curves={["RPMA", "WOBA"]}
                      xAxis={xAxis}
                    />

                    <ChartPanel
                      title="Flow"
                      data={data}
                      curves={["MFIA", "MFOP"]}
                      xAxis={xAxis}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* 🔥 FOOTER */}
        <div
          style={{
            padding: 10,
            textAlign: "center",
            borderTop: "1px solid #1e293b",
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          Developed by José Ignacio Cruz Reyes
        </div>
      </div>
    </div>
  );
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { curveUnits } from "../utils/CurveUnits";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export default function MultiAxisChart({ data, curves, xAxis }: any) {
  if (!data || data.length === 0) return <p>No data</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#1e293b" />

        <XAxis
          dataKey={xAxis}
          stroke="#cbd5f5"
          label={{
            value: xAxis === "timestamp" ? "Time" : "Seconds",
            position: "insideBottom",
            offset: -5,
          }}
        />

        {curves.map((curve: string, i: number) => (
          <YAxis
            key={curve}
            yAxisId={curve}
            orientation={i % 2 === 0 ? "left" : "right"}
            stroke={COLORS[i % COLORS.length]}
            label={{
              value: `${curve} (${curveUnits[curve] || ""})`,
              angle: -90,
              position: "insideLeft",
            }}
          />
        ))}

        <Tooltip
          formatter={(value: any, name: any) => [
            `${value} ${curveUnits[name as string] || ""}`,
            name,
          ]}
        />

        <Legend />

        {curves.map((curve: string, i: number) => (
          <Line
            key={curve}
            dataKey={curve}
            yAxisId={curve}
            stroke={COLORS[i % COLORS.length]}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

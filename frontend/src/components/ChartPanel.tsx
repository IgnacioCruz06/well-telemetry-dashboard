import MultiAxisChart from "./MultiAxisChart";

export default function ChartPanel({ title, data, curves, xAxis }: any) {
  return (
    <div className="card">
      <h3>{title}</h3>

      <div style={{ height: 400, position: "relative" }}>
        <MultiAxisChart data={data} curves={curves} xAxis={xAxis} />
      </div>
    </div>
  );
}

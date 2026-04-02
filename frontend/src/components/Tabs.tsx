import { useState } from "react";

export default function Tabs({ tabs }: any) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {tabs.map((tab: any, i: number) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`tab-button ${active === i ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs[active].content}
    </div>
  );
}
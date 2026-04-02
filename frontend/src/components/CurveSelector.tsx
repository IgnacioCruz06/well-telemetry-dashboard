export default function CurveSelector({ curves, selected, onChange }: any) {
  return (
    <div className="curve-selector">
      {curves.map((curve: string) => (
        <label key={curve}>
          <input
            type="checkbox"
            checked={selected.includes(curve)}
            onChange={() => {
              if (selected.includes(curve)) {
                onChange(selected.filter((c: string) => c !== curve));
              } else {
                onChange([...selected, curve]);
              }
            }}
          />
          {curve}
        </label>
      ))}
    </div>
  );
}
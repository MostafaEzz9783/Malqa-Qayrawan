export default function OccupancySlider({ options, value, onChange, expectedOccupancy, t }) {
  const min = options[0];
  const max = options[options.length - 1];
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full min-w-[240px] max-w-sm mx-auto">
      <p className="text-xs font-semibold mb-2 text-center" style={{ color: "#9C99AE" }}>
        {t.selectors.occupancy}
      </p>
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-center text-sm font-black mb-3" style={{ color: "#E0A876" }}>
          {value}%
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={options[1] - options[0]}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          dir="ltr"
          aria-label={t.selectors.occupancy}
          aria-valuetext={`${value}%`}
          className="w-full h-2 rounded-full appearance-none cursor-pointer arqa-slider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF7C4A]"
          style={{
            background: `linear-gradient(to right, #BF7C4A 0%, #BF7C4A ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-[11px]" style={{ color: "#6f6c82" }} dir="ltr">
          {options.map((option) => (
            <span
              key={option}
              className="rounded-full px-1.5"
              style={{
                color: option === expectedOccupancy ? "#7DE0B5" : "#6f6c82",
                fontWeight: option === expectedOccupancy ? 700 : 500,
              }}
            >
              {option}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

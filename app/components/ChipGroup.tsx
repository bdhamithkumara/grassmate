"use client";

interface Props<T extends string | number> {
  legend: string;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** A radio group styled as tappable chips. */
export default function ChipGroup<T extends string | number>({ legend, name, options, value, onChange }: Props<T>) {
  return (
    <fieldset className="chips">
      <legend>{legend}</legend>
      <div className="chip-row">
        {options.map((o) => (
          <label key={o.value} className={`chip ${o.value === value ? "selected" : ""}`}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

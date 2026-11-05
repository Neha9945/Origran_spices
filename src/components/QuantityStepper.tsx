import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (next: number) => void;
}

export default function QuantityStepper({ value, max, onChange }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-espresso-300 bg-white p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-full text-espresso-800 transition hover:bg-espresso-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[2.75rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-full text-espresso-800 transition hover:bg-espresso-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

import type { ChangeEventHandler } from "react";
import type { SelectOption } from "@/components/ui/ui.shared";

type SelectFieldProps<TValue extends string> = {
  id: string;
  name: string;
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isLabelHidden?: boolean;
};

export const SelectField = <TValue extends string>({
  id,
  name,
  label,
  value,
  options,
  onChange,
  error,
  required = false,
  disabled = false,
  isLabelHidden = false,
}: SelectFieldProps<TValue>) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className={
          isLabelHidden ? "sr-only" : "block text-sm font-medium text-slate-700"
        }
      >
        {label}
      </label>

      <div className={isLabelHidden ? "relative" : "relative mt-2"}>
        <select
          id={id}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={onChange}
          className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm leading-none outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        >
          ▾
        </span>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  isLabelHidden?: boolean;
};

export const TextField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete,
  required = false,
  disabled = false,
  isLabelHidden = false,
}: TextFieldProps) => {
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

      <input
        id={id}
        name={name}
        value={value}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      />

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
};

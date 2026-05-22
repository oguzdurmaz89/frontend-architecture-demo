import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingLabel?: string;
};

const buttonClassNames: Record<ButtonVariant, string> = {
  primary: "bg-blue-700 text-white hover:bg-blue-800 disabled:bg-blue-300",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40",
  danger: "bg-red-700 text-white hover:bg-red-800 disabled:bg-red-300",
};

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  loadingLabel = "Loading...",
  disabled,
  type = "button",
  ...buttonProps
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...buttonProps}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={`rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${buttonClassNames[variant]}`}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
};

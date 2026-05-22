import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "neutral" | "danger";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "children"
> & {
  label: string;
  children: ReactNode;
  variant?: IconButtonVariant;
};

const iconButtonClassNames: Record<IconButtonVariant, string> = {
  neutral:
    "border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-600",
  danger:
    "border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-600",
};

export const IconButton = ({
  label,
  children,
  variant = "neutral",
  type = "button",
  title,
  ...buttonProps
}: IconButtonProps) => {
  return (
    <button
      {...buttonProps}
      type={type}
      aria-label={label}
      title={title ?? label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${iconButtonClassNames[variant]}`}
    >
      {children}
    </button>
  );
};

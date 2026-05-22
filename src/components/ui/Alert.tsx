import type { ReactNode } from "react";

type AlertVariant = "success" | "error" | "info";

type AlertProps = {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
};

const alertClassNames: Record<AlertVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-slate-200 bg-slate-50 text-slate-600",
};

export const Alert = ({ variant, title, children }: AlertProps) => {
  const isError = variant === "error";
  const hasTitle = Boolean(title);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mt-5 rounded-2xl border p-4 text-sm ${alertClassNames[variant]}`}
    >
      {hasTitle ? <p className="font-medium">{title}</p> : null}

      <div className={hasTitle ? "mt-1" : undefined}>{children}</div>
    </div>
  );
};

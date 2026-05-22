import type { ReactNode } from "react";
import type { BadgeTone } from "@/components/ui/ui.shared";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const badgeClassNames: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeClassNames[tone]}`}
    >
      {children}
    </span>
  );
};

import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "success" | "warning" | "danger";
export type DataGridColumn<TRow> = {
  id: string;
  header: string;
  renderCell: (row: TRow) => ReactNode;
  width?: string;
  isSticky?: boolean;
};

export type SelectOption<TValue extends string = string> = {
  label: string;
  value: TValue;
};

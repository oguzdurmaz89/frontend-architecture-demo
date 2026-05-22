import type { CSSProperties } from "react";
import type { DataGridColumn } from "@/components/ui/ui.shared";

type DataGridProps<TRow> = {
  rows: TRow[];
  columns: DataGridColumn<TRow>[];
  getRowKey: (row: TRow) => string;
  emptyMessage: string;
  ariaLabel: string;
  minWidth?: number;
};

const getHeaderCellClassName = <TRow,>(
  column: DataGridColumn<TRow>,
): string => {
  return [
    "px-4 py-3 font-medium whitespace-nowrap",
    column.isSticky
      ? "sticky left-0 z-20 bg-slate-50 shadow-[8px_0_16px_-16px_rgba(15,23,42,0.45)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
};

const getBodyCellClassName = <TRow,>(column: DataGridColumn<TRow>): string => {
  return [
    "px-4 py-4 text-slate-600 whitespace-nowrap",
    column.isSticky
      ? "sticky left-0 z-10 bg-white shadow-[8px_0_16px_-16px_rgba(15,23,42,0.35)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
};

const getColumnStyle = <TRow,>(
  column: DataGridColumn<TRow>,
): CSSProperties | undefined => {
  if (!column.width) {
    return undefined;
  }

  return {
    width: column.width,
  };
};

export const DataGrid = <TRow,>({
  rows,
  columns,
  getRowKey,
  emptyMessage,
  ariaLabel,
  minWidth = 760,
}: DataGridProps<TRow>) => {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table
          aria-label={ariaLabel}
          className="w-full border-separate border-spacing-0 text-left text-sm"
          style={{ minWidth }}
        >
          <colgroup>
            {columns.map((column) => (
              <col key={column.id} style={getColumnStyle(column)} />
            ))}
          </colgroup>

          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={getHeaderCellClassName(column)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={getRowKey(row)} className="border-t border-slate-200">
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={getBodyCellClassName(column)}
                    >
                      {column.renderCell(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

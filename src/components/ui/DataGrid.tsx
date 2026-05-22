import type { DataGridColumn } from "@/components/ui/ui.shared";

type DataGridProps<TRow> = {
  rows: TRow[];
  columns: DataGridColumn<TRow>[];
  getRowKey: (row: TRow) => string;
  emptyMessage: string;
  ariaLabel: string;
  minWidth?: number;
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
          className="w-full border-collapse text-left text-sm"
          style={{ minWidth }}
        >
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="px-4 py-3 font-medium"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.id}
                      className={`px-4 py-4 text-slate-600 ${
                        columnIndex === 0 ? "font-medium text-slate-950" : ""
                      }`}
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

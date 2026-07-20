import { dateBR, money, statusLabel } from "@/lib/format";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  type?: "money" | "date" | "status";
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  if (rows.length === 0) {
    return <div className="card muted">Nenhum registro encontrado.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                const raw = row[column.key as keyof T];
                let value: React.ReactNode = raw ?? "-";
                if (column.render) value = column.render(row);
                if (column.type === "money") value = money(raw);
                if (column.type === "date") value = dateBR(raw);
                if (column.type === "status") value = <span className="badge">{statusLabel(raw)}</span>;
                return <td key={String(column.key)}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

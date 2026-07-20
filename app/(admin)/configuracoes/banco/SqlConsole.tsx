"use client";

import { Play, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { publicApiUrl } from "@/lib/api-url";

type SqlResult = {
  mode: "read" | "write";
  rowCount?: number;
  affectedRows?: number;
  fields: string[];
  rows: Record<string, unknown>[];
};

export function SqlConsole() {
  const [sql, setSql] = useState('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' ORDER BY table_name');
  const [confirmation, setConfirmation] = useState("");
  const [result, setResult] = useState<SqlResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isWrite = /^(insert|update|delete)\b/i.test(sql.trim());

  async function execute(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    const response = await fetch(`${publicApiUrl}/api/database/sql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sql, confirmation }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.message ?? "Não foi possível executar o SQL.");
      return;
    }
    setResult(data);
  }

  return (
    <div className="grid">
      <form className="card sql-console" onSubmit={execute}>
        <div className="sql-warning">
          <ShieldAlert size={18} />
          <span>Comandos de alteração exigem confirmação. Comandos de estrutura são bloqueados.</span>
        </div>
        <div className="field full">
          <label htmlFor="sql">SQL</label>
          <textarea id="sql" value={sql} onChange={(event) => setSql(event.target.value)} spellCheck={false} />
        </div>
        {isWrite ? (
          <div className="field">
            <label htmlFor="confirmation">Confirmação</label>
            <input id="confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="EXECUTAR" />
          </div>
        ) : null}
        {error ? <p className="badge danger">{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          <Play size={17} /> {loading ? "Executando..." : "Executar SQL"}
        </button>
      </form>
      {result ? (
        <div className="card">
          <div className="toolbar">
            <h2>Resultado</h2>
            <span className="badge">{result.mode === "read" ? `${result.rowCount ?? 0} linhas` : `${result.affectedRows ?? 0} alteradas`}</span>
          </div>
          {result.rows.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {result.fields.map((field) => <th key={field}>{field}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row, index) => (
                    <tr key={index}>
                      {result.fields.map((field) => <td key={field}>{formatCell(row[field])}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">Nenhum registro para exibir.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

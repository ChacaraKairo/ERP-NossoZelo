"use client";

import { ChevronLeft, DatabaseBackup, FolderOpen } from "lucide-react";
import { useState } from "react";
import { publicApiUrl } from "@/lib/api-url";

type Destination = {
  label: string;
  path: string;
};

type FolderListing = {
  currentPath: string;
  parentPath: string | null;
  folders: Destination[];
};

export function BackupDestinationForm({
  destinos,
  action,
}: {
  destinos: Destination[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [selectedPath, setSelectedPath] = useState("");
  const [browserOpen, setBrowserOpen] = useState(false);
  const [listing, setListing] = useState<FolderListing | null>(null);
  const [loading, setLoading] = useState(false);

  async function openBrowser(path?: string) {
    setLoading(true);
    setBrowserOpen(true);
    const query = path ? `?path=${encodeURIComponent(path)}` : "";
    const response = await fetch(`${publicApiUrl}/api/exportacoes/backup/pastas${query}`, {
      credentials: "include",
      cache: "no-store",
    });
    setLoading(false);
    if (response.ok) {
      setListing(await response.json());
    }
  }

  return (
    <form className="card backup-form" action={action}>
      <div className="backup-destination-grid">
        <div className="field">
          <label htmlFor="destino-sugerido">Local detectado</label>
          <select
            id="destino-sugerido"
            value={selectedPath}
            onChange={(event) => setSelectedPath(event.target.value)}
          >
            <option value="">Escolher local</option>
            {destinos.map((destino) => (
              <option value={destino.path} key={destino.path}>
                {destino.label} · {destino.path}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="destino">Caminho escolhido</label>
          <input
            id="destino"
            name="destino"
            value={selectedPath}
            onChange={(event) => setSelectedPath(event.target.value)}
            placeholder="/run/media/chacara/KING-128G-K"
            required
          />
        </div>
      </div>
      <div className="actions-row">
        <button className="button secondary" type="button" onClick={() => openBrowser(selectedPath || undefined)}>
          <FolderOpen size={17} /> Abrir armazenamento
        </button>
      </div>
      {browserOpen ? (
        <div className="folder-browser">
          <div className="folder-browser-bar">
            <strong>{listing?.currentPath || "Locais disponíveis"}</strong>
            {listing?.parentPath ? (
              <button className="icon-button secondary" type="button" title="Voltar pasta" aria-label="Voltar pasta" onClick={() => openBrowser(listing.parentPath ?? undefined)}>
                <ChevronLeft size={17} />
              </button>
            ) : null}
          </div>
          {loading ? <p className="muted">Carregando...</p> : null}
          <div className="folder-list">
            {listing?.folders.map((folder) => (
              <button className="folder-row" type="button" key={folder.path} onClick={() => openBrowser(folder.path)}>
                <FolderOpen size={16} />
                <span>{folder.label}</span>
                <small>{folder.path}</small>
              </button>
            ))}
          </div>
          {listing?.currentPath ? (
            <button className="button secondary" type="button" onClick={() => {
              setSelectedPath(listing.currentPath);
              setBrowserOpen(false);
            }}>
              Usar esta pasta
            </button>
          ) : null}
        </div>
      ) : null}
      <button className="button" style={{ marginTop: 18 }} type="submit">
        <DatabaseBackup size={17} /> Gerar backup completo
      </button>
      {selectedPath ? (
        <div className="backup-target">
          <FolderOpen size={16} />
          <span>{selectedPath}/ERP-NossoZelo-backup-atual</span>
        </div>
      ) : null}
    </form>
  );
}

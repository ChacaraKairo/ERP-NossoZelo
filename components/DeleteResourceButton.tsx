"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicApiUrl } from "@/lib/api-url";

export function DeleteResourceButton({
  resource,
  id,
  redirectTo,
  label = "Apagar",
  compact = false,
}: {
  resource: string;
  id: number;
  redirectTo?: string;
  label?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!confirm("Tem certeza que deseja apagar este registro?")) return;
    setDeleting(true);
    const response = await fetch(`${publicApiUrl}/api/erp/${resource}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleting(false);
    if (!response.ok) {
      alert("Não foi possível apagar o registro.");
      return;
    }
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }

  return (
    <button className={compact ? "icon-button danger" : "button danger"} type="button" onClick={remove} disabled={deleting} title="Apagar" aria-label="Apagar">
      <Trash2 size={16} /> {compact ? null : deleting ? "Apagando..." : label}
    </button>
  );
}

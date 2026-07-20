"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { publicApiUrl } from "@/lib/api-url";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "checkbox";
  required?: boolean;
  options?: { label: string; value: string | number }[];
  defaultValue?: string | number | boolean;
  full?: boolean;
};

export function FormPage({
  resource,
  redirectTo,
  fields,
}: {
  resource: string;
  redirectTo: string;
  fields: Field[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.type === "checkbox" ? formData.get(field.name) === "on" : formData.get(field.name),
      ]),
    );
    const response = await fetch(`${publicApiUrl}/api/erp/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!response.ok) {
      setError("Não foi possível salvar. Confira os campos obrigatórios.");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      {error ? <p className="badge danger">{error}</p> : null}
      <div className="form-grid">
        {fields.map((field) => (
          <div className={`field ${field.full ? "full" : ""}`} key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea id={field.name} name={field.name} required={field.required} defaultValue={String(field.defaultValue ?? "")} />
            ) : field.type === "select" ? (
              <select id={field.name} name={field.name} required={field.required} defaultValue={String(field.defaultValue ?? "")}>
                <option value="">Selecione</option>
                {field.options?.map((option) => (
                  <option value={option.value} key={String(option.value)}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <input id={field.name} name={field.name} type="checkbox" defaultChecked={Boolean(field.defaultValue)} />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                defaultValue={String(field.defaultValue ?? "")}
                step={field.type === "number" ? "0.01" : undefined}
              />
            )}
          </div>
        ))}
      </div>
      <button className="button" style={{ marginTop: 18 }} disabled={saving}>
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

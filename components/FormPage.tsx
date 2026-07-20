"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { publicApiUrl } from "@/lib/api-url";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "checkbox";
  required?: boolean;
  options?: { label: string; value: string | number; tipo?: string }[];
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
  const tipoField = fields.find((field) => field.name === "tipo");
  const [selectedTipo, setSelectedTipo] = useState(String(tipoField?.defaultValue ?? ""));
  const categoryFieldName = "categoriaId";

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
              <SelectField
                field={field}
                selectedTipo={selectedTipo}
                onTipoChange={field.name === "tipo" ? setSelectedTipo : undefined}
                filterByTipo={field.name === categoryFieldName && Boolean(tipoField)}
              />
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

function SelectField({
  field,
  selectedTipo,
  onTipoChange,
  filterByTipo,
}: {
  field: Field;
  selectedTipo: string;
  onTipoChange?: (value: string) => void;
  filterByTipo: boolean;
}) {
  const options = useMemo(() => {
    if (!filterByTipo || !selectedTipo) return field.options ?? [];
    return (field.options ?? []).filter((option) => {
      const tipo = "tipo" in option ? String(option.tipo) : "";
      return !tipo || tipo === selectedTipo || tipo === "AMBOS";
    });
  }, [field.options, filterByTipo, selectedTipo]);

  return (
    <select
      id={field.name}
      name={field.name}
      required={field.required}
      defaultValue={String(field.defaultValue ?? "")}
      onChange={onTipoChange ? (event) => onTipoChange(event.target.value) : undefined}
    >
      <option value="">Selecione</option>
      {options.map((option) => (
        <option value={option.value} key={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

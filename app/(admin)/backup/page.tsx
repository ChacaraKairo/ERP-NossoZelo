import { DatabaseBackup, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { apiGet } from "@/lib/api";
import { publicApiUrl } from "@/lib/api-url";
import { dateBR } from "@/lib/format";
import { gerarBackupLocal, registrarBackupManual } from "./actions";
import { BackupDestinationForm } from "./BackupDestinationForm";

export default async function BackupPage() {
  const [ultimoBackup, destinos] = await Promise.all([
    apiGet<any | null>("/exportacoes/ultimo-backup"),
    apiGet<{ label: string; path: string }[]>("/exportacoes/backup/destinos"),
  ]);

  return (
    <>
      <PageHeader title="Backup e exportação" description="Exportação manual em JSON e CSV para reduzir risco de perda de dados." />

      <div className="grid cards">
        <MetricCard label="Último backup registrado" value={ultimoBackup ? dateBR(ultimoBackup.criadoEm) : "Nunca"} tone={ultimoBackup ? "ok" : "warn"} />
        <MetricCard label="Formato principal" value="JSON" />
        <MetricCard label="Banco completo" value="SQL + dump" />
        <MetricCard label="Destinos encontrados" value={String(destinos.length)} />
      </div>

      <div className="toolbar" style={{ marginTop: 22 }}>
        <div>
          <h2>Backup em pasta escolhida</h2>
          <p className="muted">Informe uma pasta montada no notebook. A nova versão é criada primeiro e depois substitui a antiga.</p>
        </div>
      </div>
      <BackupDestinationForm destinos={destinos} action={gerarBackupLocal} />

      <div className="toolbar" style={{ marginTop: 22 }}>
        <div>
          <h2>Arquivos disponíveis para download</h2>
          <p className="muted">Baixe os dados essenciais no navegador ou registre um backup manual simples.</p>
        </div>
        <form action={registrarBackupManual}>
          <button className="button secondary" type="submit">
            <DatabaseBackup size={17} /> Registrar backup
          </button>
        </form>
      </div>

      <div className="grid three">
        <a className="export-tile" href={`${publicApiUrl}/api/exportacoes/dados.json`}>
          <FileJson size={24} />
          <strong>Dados completos</strong>
          <span>Empresas, financeiro, fiscal, serviços, chamados, tarefas, riscos e fechamentos.</span>
          <em><Download size={15} /> Baixar JSON</em>
        </a>
        <a className="export-tile" href={`${publicApiUrl}/api/exportacoes/financeiro.csv`}>
          <FileSpreadsheet size={24} />
          <strong>Lançamentos financeiros</strong>
          <span>Receitas, despesas, categorias, valores, competência, status e origem.</span>
          <em><Download size={15} /> Baixar CSV</em>
        </a>
        <a className="export-tile" href={`${publicApiUrl}/api/exportacoes/contas-a-pagar.csv`}>
          <FileSpreadsheet size={24} />
          <strong>Contas a pagar</strong>
          <span>Fornecedores, serviços vinculados, vencimentos, valores e status.</span>
          <em><Download size={15} /> Baixar CSV</em>
        </a>
      </div>
    </>
  );
}

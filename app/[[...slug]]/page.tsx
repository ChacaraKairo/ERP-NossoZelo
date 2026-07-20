"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Bell, Building2, CalendarDays, CheckCircle2, ClipboardList, CreditCard, FileText, Home, ListChecks, Moon, PiggyBank, ReceiptText, Search, Settings, ShieldCheck, Sun, WalletCards } from "lucide-react";

type ScreenKind = "dashboard" | "table" | "form" | "report" | "login";

type Screen = {
  path: string;
  title: string;
  subtitle: string;
  kind: ScreenKind;
  cta?: string;
  navGroup: string;
};

const screens: Screen[] = [
  { path: "login", title: "Acesso ao ERP", subtitle: "Entre para controlar a operação interna do NossoZelo.", kind: "login", navGroup: "Sistema" },
  { path: "dashboard", title: "Dashboard da Empresa", subtitle: "Visão executiva da saúde financeira, fiscal e operacional.", kind: "dashboard", cta: "Novo lançamento", navGroup: "Gestão" },
  { path: "alertas", title: "Central de Alertas", subtitle: "Tudo que exige ação: vencimentos, riscos, chamados e pendências.", kind: "table", cta: "Criar tarefa", navGroup: "Gestão" },
  { path: "calendario", title: "Calendário Operacional", subtitle: "Eventos de DAS, cobranças, renovações, tarefas e fechamentos.", kind: "report", cta: "Novo evento", navGroup: "Gestão" },
  { path: "financeiro", title: "Financeiro", subtitle: "Receitas, despesas, resultado do mês e previsão de caixa.", kind: "dashboard", cta: "Lançar valor", navGroup: "Financeiro" },
  { path: "financeiro/lancamentos", title: "Lançamentos Financeiros", subtitle: "Histórico de entradas e saídas da empresa.", kind: "table", cta: "Novo lançamento", navGroup: "Financeiro" },
  { path: "financeiro/lancamentos/novo", title: "Novo Lançamento", subtitle: "Registre uma receita ou despesa com categoria e comprovante.", kind: "form", cta: "Salvar", navGroup: "Financeiro" },
  { path: "financeiro/contas-a-pagar", title: "Contas a Pagar", subtitle: "Despesas previstas, recorrências e fornecedores.", kind: "table", cta: "Nova conta", navGroup: "Financeiro" },
  { path: "financeiro/contas-a-pagar/nova", title: "Nova Conta a Pagar", subtitle: "Cadastre uma obrigação financeira futura.", kind: "form", cta: "Salvar conta", navGroup: "Financeiro" },
  { path: "financeiro/contas-a-receber", title: "Contas a Receber", subtitle: "Cobranças, assinaturas e receitas pendentes.", kind: "table", cta: "Nova cobrança", navGroup: "Financeiro" },
  { path: "servicos-contratados", title: "Serviços Contratados", subtitle: "AWS, Render, Vercel, domínio, banco, e-mail e ferramentas.", kind: "table", cta: "Novo serviço", navGroup: "Infra" },
  { path: "servicos-contratados/novo", title: "Novo Serviço Contratado", subtitle: "Registre plano, moeda, criticidade, renovação e responsável.", kind: "form", cta: "Salvar serviço", navGroup: "Infra" },
  { path: "fornecedores", title: "Fornecedores", subtitle: "Empresas, plataformas e prestadores que atendem a operação.", kind: "table", cta: "Novo fornecedor", navGroup: "Infra" },
  { path: "fiscal", title: "Fiscal / MEI", subtitle: "DAS, notas fiscais, vencimentos e obrigações da empresa.", kind: "dashboard", cta: "Registrar DAS", navGroup: "Fiscal" },
  { path: "fiscal/obrigacoes", title: "Obrigações MEI", subtitle: "Controle de DAS, declaração anual e pendências fiscais.", kind: "table", cta: "Nova obrigação", navGroup: "Fiscal" },
  { path: "fiscal/notas-fiscais", title: "Notas Fiscais", subtitle: "Notas emitidas manualmente, tomadores e anexos.", kind: "table", cta: "Nova nota", navGroup: "Fiscal" },
  { path: "marketplace/clientes", title: "Clientes", subtitle: "Usuários do marketplace vinculados à operação.", kind: "table", cta: "Exportar", navGroup: "Marketplace" },
  { path: "marketplace/prestadores", title: "Prestadores", subtitle: "Prestadores, status de cadastro, documentos e assinatura.", kind: "table", cta: "Revisar pendentes", navGroup: "Marketplace" },
  { path: "marketplace/assinaturas", title: "Assinaturas", subtitle: "Planos, vencimentos, inadimplência e cancelamentos.", kind: "table", cta: "Sincronizar Asaas", navGroup: "Marketplace" },
  { path: "suporte/chamados", title: "Chamados", subtitle: "Atendimento de clientes, prestadores e operação interna.", kind: "table", cta: "Novo chamado", navGroup: "Operação" },
  { path: "suporte/chamados/novo", title: "Novo Chamado", subtitle: "Registre uma solicitação, bug, dúvida ou problema de pagamento.", kind: "form", cta: "Abrir chamado", navGroup: "Operação" },
  { path: "tarefas", title: "Tarefas Internas", subtitle: "Bugs, melhorias, rotinas fiscais, suporte e infraestrutura.", kind: "table", cta: "Nova tarefa", navGroup: "Operação" },
  { path: "relatorios/custos-infraestrutura", title: "Custos de Infraestrutura", subtitle: "Análise de AWS, Render, Vercel, banco, e-mail e serviços em dólar.", kind: "report", cta: "Exportar", navGroup: "Relatórios" },
  { path: "planejamento/mensal", title: "Planejamento Mensal", subtitle: "Metas, orçamento, riscos, prioridades e previsão de resultado.", kind: "form", cta: "Salvar planejamento", navGroup: "Relatórios" },
  { path: "fechamento-mensal", title: "Fechamento Mensal", subtitle: "Rotina de fechamento financeiro, fiscal e operacional do mês.", kind: "report", cta: "Fechar mês", navGroup: "Relatórios" },
  { path: "cofre-referencias", title: "Cofre de Referências", subtitle: "Onde estão guardados acessos e credenciais, sem salvar segredos.", kind: "table", cta: "Nova referência", navGroup: "Segurança" },
  { path: "riscos", title: "Painel de Riscos", subtitle: "Riscos financeiros, técnicos, fiscais, segurança e operação.", kind: "table", cta: "Novo risco", navGroup: "Segurança" },
  { path: "decisoes", title: "Diário de Decisões", subtitle: "Histórico de decisões estratégicas e seus motivos.", kind: "table", cta: "Nova decisão", navGroup: "Gestão" },
  { path: "base-conhecimento", title: "Base de Conhecimento", subtitle: "Processos internos: DAS, NFS-e, AWS, suporte e backups.", kind: "table", cta: "Novo artigo", navGroup: "Gestão" },
  { path: "auditoria", title: "Auditoria", subtitle: "Registro de ações sensíveis executadas no ERP.", kind: "table", cta: "Exportar logs", navGroup: "Segurança" },
  { path: "configuracoes", title: "Configurações", subtitle: "Preferências, tema, perfis, permissões e parâmetros do ERP.", kind: "form", cta: "Salvar", navGroup: "Sistema" },
];

const navIcons: Record<string, React.ReactNode> = {
  Gestão: <Home size={17} />,
  Financeiro: <PiggyBank size={17} />,
  Infra: <Building2 size={17} />,
  Fiscal: <ReceiptText size={17} />,
  Marketplace: <WalletCards size={17} />,
  Operação: <ClipboardList size={17} />,
  Relatórios: <BarChart3 size={17} />,
  Segurança: <ShieldCheck size={17} />,
  Sistema: <Settings size={17} />,
};

const metrics = [
  ["Receita do mês", "R$ 4.980", "+18% vs mês anterior"],
  ["Despesas previstas", "R$ 812", "R$ 126 em dólar"],
  ["Saldo projetado", "R$ 3.742", "após contas do mês"],
  ["Pendências críticas", "7", "2 vencem hoje"],
];

const rows = [
  ["AWS S3", "Infraestrutura", "US$ 3,20", "Ativo", "success"],
  ["Render Backend", "Servidor", "US$ 7,00", "Renova em 6 dias", "warning"],
  ["DAS MEI", "Fiscal", "R$ 76,90", "Pendente", "danger"],
  ["Asaas", "Pagamentos", "Por transação", "Operando", "success"],
  ["Domínio", "Registro.br", "R$ 40/ano", "OK", "info"],
];

function normalizeSlug(slug?: string[]) {
  const value = slug?.join("/") || "dashboard";
  return value === "" ? "dashboard" : value;
}

export default function Page({ params }: { params: { slug?: string[] } }) {
  const [dark, setDark] = useState(false);
  const currentPath = normalizeSlug(params.slug);
  const screen = screens.find((item) => item.path === currentPath) || screens.find((item) => item.path === "dashboard")!;
  const groups = useMemo(() => [...new Set(screens.filter((s) => s.path !== "login").map((s) => s.navGroup))], []);

  if (screen.kind === "login") {
    return <LoginScreen dark={dark} setDark={setDark} />;
  }

  return (
    <main className={dark ? "dark app" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">NZ</div>
          <div>
            <h1>NossoZelo</h1>
            <p>ERP interno</p>
          </div>
        </div>
        <nav className="nav">
          {groups.map((group) => (
            <div key={group}>
              <div className="nav-title">{group}</div>
              {screens.filter((item) => item.navGroup === group && item.path !== "login").slice(0, 5).map((item) => (
                <a key={item.path} className={item.path === screen.path ? "active" : ""} href={`/${item.path}`}>
                  {navIcons[group]} {item.title.replace(" da Empresa", "")}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      <section className="main">
        <div className="topbar">
          <div className="search"><Search size={16} /> Buscar serviço, conta, chamado, nota ou prestador...</div>
          <div className="actions">
            <button className="btn" onClick={() => setDark(!dark)}>{dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? "Claro" : "Escuro"}</button>
            <button className="btn"><Bell size={16} /> 7 alertas</button>
            <div className="avatar">K</div>
          </div>
        </div>

        <header className="hero">
          <div>
            <span className="pill">Identidade NossoZelo • {dark ? "Tema escuro" : "Tema claro"}</span>
            <h2>{screen.title}</h2>
            <p>{screen.subtitle}</p>
          </div>
          {screen.cta && <button className="btn primary">{screen.cta}</button>}
        </header>

        {screen.kind === "dashboard" && <DashboardContent />}
        {screen.kind === "table" && <TableContent title={screen.title} />}
        {screen.kind === "form" && <FormContent title={screen.title} />}
        {screen.kind === "report" && <ReportContent />}
      </section>
    </main>
  );
}

function LoginScreen({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <main className={dark ? "dark login" : "login"}>
      <section className="login-visual">
        <div className="logo-big">NossoZelo</div>
        <div>
          <h1>ERP interno para operar com controle.</h1>
          <p>Financeiro, MEI, infraestrutura, serviços contratados, suporte e decisões em uma única central.</p>
        </div>
      </section>
      <section className="login-card">
        <div className="login-box card">
          <span className="pill">Acesso administrativo</span>
          <h2>Entrar no ERP</h2>
          <div className="form" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field"><label>E-mail</label><input placeholder="admin@nossozelo.com.br" /></div>
            <div className="field"><label>Senha</label><input type="password" placeholder="••••••••" /></div>
            <button className="btn primary">Entrar</button>
            <button className="btn" onClick={() => setDark(!dark)}>Alternar para {dark ? "tema claro" : "tema escuro"}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardContent() {
  return (
    <>
      <section className="grid metrics">{metrics.map(([label, value, trend]) => <div className="card metric" key={label}><small>{label}</small><strong>{value}</strong><div className="trend">{trend}</div></div>)}</section>
      <section className="grid content-grid">
        <div className="card"><div className="section-title"><h3>Fluxo do mês</h3><span className="tag success">saudável</span></div><Bars /></div>
        <div className="card"><div className="section-title"><h3>Ações rápidas</h3><span className="tag warning">prioridade</span></div><ActionList /></div>
      </section>
    </>
  );
}

function TableContent({ title }: { title: string }) {
  return <section className="card"><div className="section-title"><h3>{title}</h3><span className="tag info">5 registros</span></div><table className="table"><thead><tr><th>Nome</th><th>Categoria</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><span className={`tag ${row[4]}`}>{row[3]}</span></td><td><button className="btn">Abrir</button></td></tr>)}</tbody></table></section>;
}

function FormContent({ title }: { title: string }) {
  return <section className="card"><div className="section-title"><h3>{title}</h3><span className="tag success">rascunho</span></div><div className="form"><div className="field"><label>Nome/Título</label><input placeholder="Ex: AWS S3 Produção" /></div><div className="field"><label>Categoria</label><select><option>Infraestrutura</option><option>Financeiro</option><option>Fiscal</option><option>Suporte</option></select></div><div className="field"><label>Valor previsto</label><input placeholder="R$ 0,00" /></div><div className="field"><label>Status</label><select><option>Ativo</option><option>Pendente</option><option>Crítico</option></select></div><div className="field full"><label>Observações</label><textarea rows={5} placeholder="Registre contexto, decisão, vencimento ou vínculo com o NossoZelo." /></div><div className="field full"><button className="btn primary">Salvar registro</button></div></div></section>;
}

function ReportContent() {
  return <section className="grid content-grid"><div className="card"><div className="section-title"><h3>Comparativo planejado x real</h3><span className="tag success">atualizado</span></div><Bars /></div><div className="card"><div className="section-title"><h3>Resumo executivo</h3><span className="tag warning">revisar</span></div><ActionList /></div></section>;
}

function Bars() {
  const values = [45, 72, 58, 86, 64, 92];
  return <div className="bars">{values.map((value, index) => <div className="bar" key={index} style={{ height: `${value}%` }}><span>{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][index]}</span></div>)}</div>;
}

function ActionList() {
  const actions = ["Pagar DAS até dia 20", "Revisar custo AWS S3", "Fechar mês financeiro", "Responder chamados críticos", "Rotacionar credenciais IAM"];
  return <div className="list">{actions.map((item, index) => <div className="list-item" key={item}><div><strong>{item}</strong><br /><small>{index < 2 ? "Alta prioridade" : "Operação"}</small></div>{index < 2 ? <AlertTriangle color="var(--warning)" /> : <CheckCircle2 color="var(--success)" />}</div>)}</div>;
}

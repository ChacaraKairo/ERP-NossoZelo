import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Gauge,
  Headset,
  Landmark,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { publicApiUrl } from "@/lib/api-url";

const nav = [
  { section: "Empresa", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/financeiro", label: "Financeiro", icon: Landmark },
    { href: "/servicos-contratados", label: "Serviços", icon: BriefcaseBusiness },
    { href: "/fiscal", label: "Fiscal/MEI", icon: ReceiptText },
  ] },
  { section: "Operação", items: [
    { href: "/marketplace/clientes", label: "Clientes", icon: Users },
    { href: "/marketplace/prestadores", label: "Prestadores", icon: ShieldCheck },
    { href: "/marketplace/assinaturas", label: "Assinaturas", icon: FileText },
    { href: "/suporte/chamados", label: "Suporte", icon: Headset },
    { href: "/tarefas", label: "Tarefas", icon: ClipboardList },
  ] },
  { section: "Controle", items: [
    { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
    { href: "/auditoria", label: "Auditoria", icon: Gauge },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ] },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">
            <ShieldCheck size={19} />
          </span>
          <span>ERP NossoZelo</span>
        </Link>
        {nav.map((group) => (
          <div key={group.section}>
            <div className="nav-section">{group.section}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link className="nav-link" href={item.href} key={item.href}>
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <strong>{user.nome}</strong>
            <span className="muted"> · {user.perfil.toLowerCase()}</span>
          </div>
          <form action={`${publicApiUrl}/api/auth/logout`} method="post">
            <button className="icon-button secondary" title="Sair" aria-label="Sair">
              <LogOut size={17} />
            </button>
          </form>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

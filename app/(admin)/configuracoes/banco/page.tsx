import { PageHeader } from "@/components/PageHeader";
import { SqlConsole } from "./SqlConsole";

export default function BancoPage() {
  return (
    <>
      <PageHeader title="Banco de dados" description="Consulta e manutenção controlada dos dados do ERP." />
      <SqlConsole />
    </>
  );
}

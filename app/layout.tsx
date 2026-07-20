import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP NossoZelo",
  description: "ERP interno de gestão do marketplace NossoZelo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

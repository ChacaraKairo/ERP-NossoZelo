import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  title: "ERP NossoZelo",
  description: "ERP interno para gestão da empresa NossoZelo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

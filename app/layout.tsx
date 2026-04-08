import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

// 👇 AQUI COMEÇA A MÁGICA DO SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://vulp.vc'), // Seu domínio oficial
  title: {
    default: "VULP | Onde Talentos Encontram Oportunidades",
    template: "%s | VULP" // Ex: "Dashboard | VULP"
  },
  description: "A VULP conecta alunos capacitados a empresas que buscam inovação. Treinamento, certificação e mercado de trabalho em um só lugar.",
  keywords: ["Recrutamento", "Vagas", "Estágio", "Marketing Digital", "Talentos", "Vulp"],
  openGraph: {
    title: "VULP | Contrate os Melhores Talentos",
    description: "Acesse nossa base exclusiva de alunos certificados e impulsione sua empresa.",
    url: 'https://vulp.vc',
    siteName: 'VULP Platform',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "VULP | A Plataforma de Talentos",
    description: "Conecte-se com o futuro do mercado de trabalho.",
  },
};
// 👆 FIM DA MÁGICA

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
      <body className={inter.className}>
        {children}
        <Analytics /> {/* 🟢 O RADAR DA VERCEL AQUI */}
      </body>
    </html>
  );
}
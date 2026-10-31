import type { Metadata } from "next";
import "./globals.css";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
const display = Fraunces({ subsets: ["vietnamese", "latin"], weight: ["800"], variable: "--font-fraunces", display: "swap" });
const sans = Be_Vietnam_Pro({ subsets: ["vietnamese", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-be-vietnam", display: "swap" });

export const metadata: Metadata = {
  title: "BODY MUSE",
  description: "Nước hoa và chăm sóc cơ thể dành cho nam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}

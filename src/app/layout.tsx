import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BODY MUSE",
  description: "Nước hoa và chăm sóc cơ thể dành cho nam.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

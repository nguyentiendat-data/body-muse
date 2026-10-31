import type { Metadata } from "next";
import "./globals.css";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
const display = Fraunces({
  preload: false,
  subsets: ["vietnamese"],
  weight: ["800"],
  variable: "--font-fraunces",
  display: "swap",
});
const sans = Be_Vietnam_Pro({
  preload: false,
  subsets: ["vietnamese"],
  weight: ["400"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "BODY MUSE",
  description: "Nước hoa và chăm sóc cơ thể dành cho nam.",
  icons: { icon: "/logo-badge.png" },
  openGraph: {
    title: "BODY MUSE",
    description: "Mùi hương của riêng bạn, từ đầu đến chân.",
    locale: "vi_VN",
    type: "website",
    images: process.env.NEXT_PUBLIC_SITE_URL ? ["/logo-badge.png"] : [],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}

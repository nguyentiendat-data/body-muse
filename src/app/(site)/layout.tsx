import { SiteShell } from "@/components/site-shell";
import "./storefront-reference.css";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteShell>{children}</SiteShell>;
}

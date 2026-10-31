import { Account } from "@/components/account";
export const metadata = { title: "Đăng nhập | BODY MUSE", robots: { index: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) { return <Account mode="login" next={(await searchParams).next} />; }

import { CartContent } from "@/components/shopping";
export const metadata = { title: "Giỏ hàng | BODY MUSE" };
export default function Page() {
  return (
    <main id="main" className="page max-w-3xl">
      <h1 className="title">Giỏ hàng của bạn</h1>
      <CartContent />
    </main>
  );
}

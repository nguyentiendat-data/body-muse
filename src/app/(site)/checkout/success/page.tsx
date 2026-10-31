import { Success } from "@/components/shopping";
export const metadata = {
  title: "Đã nhận đơn hàng | BODY MUSE",
  robots: { index: false },
};
export default function Page() {
  return (
    <main id="main" className="page">
      <Success />
    </main>
  );
}

import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page">
      <h1 className="title">Trang này đi đâu mất rồi.</h1>
      <Link className="btn primary" href="/">
        Về trang chủ
      </Link>
    </main>
  );
}

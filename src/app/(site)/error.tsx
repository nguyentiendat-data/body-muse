"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main id="main" className="page"><h1 className="title">Chưa thể tải trang.</h1><p>Vui lòng thử lại sau một chút.</p><button className="btn primary mt-6" onClick={reset}>Thử lại</button></main>; }

"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, quizResults, resolveQuiz } from "@/data/quiz";
import { scentNames, scentNotes } from "@/data/products";
import { request } from "@/lib/client-api";
import { useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import { CatalogState, money, ProductGrid, useProducts } from "./catalog";
import type { OrderLookup } from "@/types/api";
export function Quiz() {
  const [answers, setAnswers] = useState<number[]>([]); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const router = useRouter(); const question = quizQuestions[Math.min(answers.length, 4)];
  async function choose(index: number) {
    const next = [...answers.slice(0, 4), index]; setError("");
    if (answers.length < 4) { setAnswers([...answers, index]); return; }
    setBusy(true); const scent = resolveQuiz(next);
    try { await request("/api/quiz", { answers: next, scent }); track("quiz_complete", { scent }); router.push(`/quiz/result?scent=${scent}`); }
    catch (error) { setError((error as Error).message); } finally { setBusy(false); }
  }
  return <main id="main" className="page max-w-3xl"><p className="font-bold mb-4">TÌM MÙI CỦA BẠN · Câu {Math.min(answers.length + 1, 5)}/5</p><progress max={5} value={answers.length + 1} className="w-full accent-cobalt mb-8" aria-label="Tiến độ trắc nghiệm" /><h1 className="font-display text-[36px] md:text-[44px] leading-tight font-extrabold mb-8" aria-live="polite">{question.question}</h1><div className="grid gap-4">{question.answers.map((answer, index) => <button className="panel text-left font-semibold text-lg hover:bg-mint min-h-[68px]" key={answer} disabled={busy} onClick={() => choose(index)}>{answer}</button>)}</div>{busy && <p role="status" className="mt-5">Đang tìm mùi dành cho bạn…</p>}{error && <p role="alert" className="text-danger mt-5">{error}</p>}{answers.length > 0 && <button className="btn mt-6" disabled={busy} onClick={() => setAnswers(answers.slice(0, -1))}>Câu trước</button>}</main>;
}
export function QuizResult({ scent }: { scent: keyof typeof quizResults }) {
  const { products, error, loading } = useProducts(); const cart = useCart(); const result = quizResults[scent]; const recommended = products.filter(product => result.productIds.includes(product.id)); const notes = scentNotes[scent];
  return <main id="main" className="page"><section className={`panel mb-10 ${scent === "daisy-blue" ? "!bg-daisy" : scent === "peony-amber" ? "!bg-peony" : "!bg-soda"}`}><p className="font-bold mb-4">MÙI HƯƠNG DÀNH CHO BẠN</p><h1 className="title">{scentNames[scent]}</h1><p className="max-w-2xl text-lg">{result.reason}</p><div className="grid md:grid-cols-3 gap-4 mt-8">{[["Hương đầu", notes.top], ["Hương giữa", notes.mid], ["Hương cuối", notes.base]].map(([label, text]) => <div className="notice bg-cream" key={label}><h2 className="font-bold">{label}</h2><p className="mt-2">{text}</p></div>)}</div></section><h2 className="section-title mb-6">Bắt đầu với 3 sản phẩm này</h2><CatalogState loading={loading} error={error} /><ProductGrid products={recommended} /><div className="flex flex-wrap gap-4 mt-8"><button className="btn primary" disabled={recommended.length !== 3 || recommended.some(product => product.stock < 1)} onClick={() => recommended.forEach(product => cart.add(product))}>Thêm cả 3 vào giỏ</button><Link className="btn" href="/quiz">Làm lại</Link></div></main>;
}
export function TrackOrder() {
  const [result, setResult] = useState<OrderLookup | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  return <main id="main" className="page max-w-2xl"><h1 className="title">Đơn của bạn tới đâu rồi?</h1><form className="panel grid gap-5" onSubmit={async event => { event.preventDefault(); setBusy(true); setError(""); setResult(null); const form = new FormData(event.currentTarget); try { setResult(await request<OrderLookup>(`/api/orders/${encodeURIComponent(String(form.get("code")).trim().toUpperCase())}?phone=${encodeURIComponent(String(form.get("phone")))}`)); } catch (error) { setError((error as Error).message); } finally { setBusy(false); } }}><label>Mã đơn hàng<input name="code" placeholder="BM-0001" required maxLength={30} /></label><label>Số điện thoại đặt hàng<input type="tel" inputMode="numeric" pattern="0[0-9]{9}" name="phone" autoComplete="tel" required /></label><button className="btn primary" disabled={busy}>{busy ? "Đang tra cứu…" : "Tra cứu đơn hàng"}</button>{error && <p role="alert" className="text-danger">{error}</p>}</form>{result && <section className="panel mt-6" aria-live="polite"><h2 className="text-2xl font-bold">{result.code}</h2><p className="my-4">Trạng thái: <b>{{ new: "Mới", shipping: "Đang giao", done: "Đã giao", cancelled: "Đã hủy" }[result.status]}</b></p>{result.items.map((item, index) => <p className="my-2" key={index}>{item.name} × {item.qty} · {money(item.priceVnd * item.qty)}</p>)}<p className="font-bold text-cobalt-text mt-4">Tổng: {money(result.totalVnd)}</p><p className="mt-3">Ngày đặt: {new Date(result.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p></section>}</main>;
}

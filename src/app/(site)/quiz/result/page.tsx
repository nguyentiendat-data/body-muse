import { QuizResult } from "@/components/quiz-track";
import { quizResults } from "@/data/quiz";
export const metadata = { title: "Mùi hương của bạn | BODY MUSE" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ scent?: string }>;
}) {
  const { scent } = await searchParams;
  return (
    <QuizResult
      scent={
        scent && Object.hasOwn(quizResults, scent)
          ? (scent as keyof typeof quizResults)
          : "daisy-blue"
      }
    />
  );
}

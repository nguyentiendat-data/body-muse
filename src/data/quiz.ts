import type { Scent } from "@/types/api";

export const quizQuestions = [
  {
    question: "Cuối tuần lý tưởng của bạn là gì?",
    answers: [
      "Cà phê và một cuốn sách",
      "Đi chơi tối cùng bạn bè",
      "Chạy bộ hay đá bóng ngoài trời",
    ],
  },
  {
    question: "Thời tiết nào làm bạn thấy dễ chịu nhất?",
    answers: [
      "Nắng nhẹ, trời trong",
      "Trời mát, về chiều",
      "Nắng nóng, đổ mồ hôi",
    ],
  },
  {
    question: "Bạn muốn người khác nhớ gì về mình?",
    answers: ["Gọn gàng, sạch sẽ", "Quyến rũ, khó đoán", "Năng lượng, vui vẻ"],
  },
  {
    question: "Bạn dùng mùi hương nhiều nhất khi nào?",
    answers: ["Đi học, đi làm", "Hẹn hò, tiệc tối", "Tập gym, chơi thể thao"],
  },
  {
    question: "Bạn chọn màu nào?",
    answers: ["Xanh cobalt", "Cam đào", "Xanh bạc hà"],
  },
] as const;
export const quizScents = ["daisy-blue", "peony-amber", "mint-soda"] as const;
export const quizResults = {
  "daisy-blue": {
    reason:
      "Bạn thích sự gọn gàng và dễ chịu. Daisy Blue tươi và sạch, dùng hằng ngày không bị nồng, hợp đi học và đi làm.",
    productIds: ["BM-01", "BM-09", "BM-10"],
  },
  "peony-amber": {
    reason:
      "Bạn thích sự quyến rũ và hơi khó đoán. Peony Amber ấm và mềm, hợp những buổi tối và những buổi hẹn.",
    productIds: ["BM-02", "BM-05", "BM-08"],
  },
  "mint-soda": {
    reason:
      "Bạn năng động và hay vận động. Mint Soda mát lạnh, tạo cảm giác sảng khoái kể cả khi trời nóng hay sau khi tập.",
    productIds: ["BM-03", "BM-04", "BM-07"],
  },
};
export function resolveQuiz(answers: readonly number[]): Exclude<Scent, "all"> {
  if (
    answers.length !== 5 ||
    answers.some(
      (answer) => !Number.isInteger(answer) || answer < 0 || answer > 2,
    )
  )
    throw new Error("Vui lòng trả lời đủ 5 câu hỏi.");
  const counts = quizScents.map(
    (_, index) => answers.filter((answer) => answer === index).length,
  );
  const max = Math.max(...counts);
  const winners = counts
    .map((count, index) => (count === max ? index : -1))
    .filter((index) => index >= 0);
  return quizScents[winners.length > 1 ? answers[0] : winners[0]];
}

import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const apiKey = process.env.API_KEY;
  if (!apiKey) return res.status(500).send("Missing API_KEY env var");

  const ai = new GoogleGenAI({ apiKey });

  const { player, lang } = req.body || {};
  if (!player?.name) return res.status(400).send("Missing player.name");

  // ✅ 你的原 prompt，保留
  const prompt =
    lang === "zh"
      ? `请为名为 ${player.name} 的扑克玩家起一个极具霸气且带有中国玄学色彩（如五行、周易）的外号。目前胜场：${player.stats?.wins ?? 0}。要求：积极、响亮、简短（4-6字）。严禁任何乱码或非汉字字符。`
      : `Generate a cool, aggressive, and mystical nickname (I-Ching/Five Elements style) for a poker player named ${player.name}. Wins: ${player.stats?.wins ?? 0}. Tone: Positive, bold, short (2-4 words). No technical strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.9, maxOutputTokens: 50 },
    });

    // 兜底清洗（可选）
    const title = (response.text?.trim() || "").replace(/[a-zA-Z0-9]{5,}/g, "");
    return res.status(200).json({ title: title || (lang === "zh" ? "九五至尊" : "Dragon King") });
  } catch (e: any) {
    return res.status(200).json({ title: lang === "zh" ? "乾坤大将" : "Grand Master" });
  }
}

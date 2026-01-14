import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing GOOGLE_API_KEY on server" });
    }

    const { scores, lang } = req.body || {};
    if (!scores || !lang) {
      return res.status(400).json({ error: "Missing scores or lang" });
    }

    const scoreSummary = Object.entries(scores)
      .map(([name, score]) => `${name}: ${score}`)
      .join(", ");

    const prompt =
      lang === "zh"
        ? `根据当前扑克比分：${scoreSummary}。请结合当下的阴阳运势、五行八卦和易经，给出一句充满玄学气息且积极向上的比赛点评。要求：1) 语言优美，富有古风韵味。2) 严禁包含任何随机字符、代码、ID、乱码或技术缩写。3) 字数在30字以内。`
        : `Based on current poker scores: ${scoreSummary}. Combine traditional Chinese metaphysics (I-Ching, five elements) to give one uplifting mystic match line. Requirements: 1) Pure natural language, no technical jargon or IDs. 2) Under 20 words.`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // @google/genai 通常是 response.text() 或 response.candidates[0]...，
    // 这里做一个兼容提取：
    const text =
      (response as any)?.text?.() ??
      (response as any)?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
      "";

    return res.status(200).json({ text: String(text).trim() });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
}

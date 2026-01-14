
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMysticAnalysis(scores: Record<string, number>, lang: 'zh' | 'en'): Promise<string> {
  const scoreSummary = Object.entries(scores).map(([name, score]) => `${name}: ${score}`).join(', ');
  const prompt = lang === 'zh' 
    ? `根据当前扑克比分：${scoreSummary}。请结合当下的阴历运势、五行八卦和易经，给出一句充满玄学气息且积极向上的比赛点评。
       要求：
       1. 语言优美，富有古风韵味。
       2. 严禁包含任何随机字符、代码、ID、乱码或技术缩写（如ws5xu7noa, 2q等）。
       3. 字数在30字以内。`
    : `Based on current poker scores: ${scoreSummary}. Combine traditional Chinese metaphysics (I-Ching, Five Elements) to give an encouraging and mystical one-sentence comment. 
       Requirements:
       1. Pure natural language, no technical jargon or IDs.
       2. Under 20 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 40 }
      }
    });
    // Filter out any suspicious alphanumeric sequences just in case
    let text = response.text?.trim() || (lang === 'zh' ? '博弈之道，乾坤未定。' : 'The flow of the universe is still in flux.');
    return text.replace(/[a-zA-Z0-9]{5,}/g, ''); // Clean potential hallucinated IDs
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'zh' ? '时来天地皆同力，气聚乾坤定输赢。' : 'Fortune favors the bold and the wise.';
  }
}

export async function generateMysticTitle(player: any, lang: 'zh' | 'en'): Promise<string> {
  const prompt = lang === 'zh'
    ? `请为名为 ${player.name} 的扑克玩家起一个极具霸气且带有中国玄学色彩（如五行、周易）的外号。目前胜场：${player.stats.wins}。要求：积极、响亮、简短（4-6字）。严禁任何乱码或非汉字字符。`
    : `Generate a cool, aggressive, and mystical nickname (I-Ching/Five Elements style) for a poker player named ${player.name}. Wins: ${player.stats.wins}. Tone: Positive, bold, short (2-4 words). No technical strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        temperature: 0.9, 
        maxOutputTokens: 50,
        thinkingConfig: { thinkingBudget: 25 }
      }
    });
    return response.text?.trim() || (lang === 'zh' ? '九五至尊' : 'Dragon King');
  } catch (error) {
    return lang === 'zh' ? '乾坤大将' : 'Grand Master';
  }
}

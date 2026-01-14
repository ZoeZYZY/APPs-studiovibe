type MysticResult = { text: string };
type TitleResult = { title: string };

export async function getMysticAnalysis(
  scores: Record<string, number>,
  lang: "zh" | "en"
): Promise<string> {
  const res = await fetch("/api/mystic-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scores, lang }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as Partial<MysticResult>;
  const text = (data.text || "").trim();
  if (!text) throw new Error("Empty response from /api/mystic-analysis");
  return text;
}

export async function generateMysticTitle(
  player: any,
  lang: "zh" | "en"
): Promise<string> {
  const res = await fetch("/api/mystic-title", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, lang }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as Partial<TitleResult>;
  const title = (data.title || "").trim();
  if (!title) throw new Error("Empty response from /api/mystic-title");
  return title;
}

import * as cheerio from "cheerio";

export async function simulateAiCitation(input: string) {
  const url = input.startsWith("http") ? input : `https://${input}`;
  const res = await fetch(url, { headers: { "User-Agent": "GPTBot/1.2" } });
  const html = await res.text();
  const $ = cheerio.load(html);

  $("script, style, nav, footer, svg").remove();

  const title = $("title").text().trim();
  const h1 = $("h1").first().text().trim();
  const paragraphs = $("p, li")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter((t) => t.length >= 45 && t.length <= 320);

  const citableSnippets = paragraphs
    .filter((p) => /(\d+%|\d+x|\d+\+|is a|built for|founded|offers|helps|proven|rank)/i.test(p))
    .slice(0, 6);

  const hasJsonLd = html.includes("application/ld+json");
  const hasListsOrTables = $("ul, ol, table").length >= 2;

  const blindSpots: string[] = [];
  if (!h1) {
    blindSpots.push("Missing primary <h1> anchor topic for LLM passage chunking.");
  }
  if (citableSnippets.length < 3) {
    blindSpots.push("Low factual/stat density: add concrete metrics, definitions, and clear claims.");
  }
  if (!hasListsOrTables) {
    blindSpots.push("No structured lists or comparison tables for easy AI table/bullet extraction.");
  }
  if (!hasJsonLd) {
    blindSpots.push("No JSON-LD entity graph: AI models must guess your brand relationships.");
  }

  const rawScore =
    25 +
    (h1 ? 15 : 0) +
    Math.min(30, citableSnippets.length * 6) +
    (hasJsonLd ? 20 : 0) +
    (hasListsOrTables ? 10 : 0);

  const citationProbability = Math.min(99, Math.max(15, rawScore));

  return {
    url,
    title,
    primaryEntityTopic: h1 || title,
    citationProbability,
    citableSnippets,
    blindSpots,
  };
}

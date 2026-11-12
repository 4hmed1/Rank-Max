import * as cheerio from "cheerio";

export async function generateLlmsTxt(input: string): Promise<string> {
  const url = input.startsWith("http") ? input : `https://${input}`;
  const origin = new URL(url).origin;
  const res = await fetch(url, { headers: { "User-Agent": "RankMax/0.3" } });
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $("title").text().trim() || new URL(url).hostname;
  const desc =
    $('meta[name="description"]').attr("content")?.trim() ||
    "Official website and documentation.";

  const seen = new Set<string>();
  const pages: { label: string; href: string }[] = [];

  $("a[href]").each((_, el) => {
    const rawHref = $(el).attr("href")?.trim();
    const label = $(el).text().replace(/\s+/g, " ").trim();
    if (!rawHref || !label || label.length > 60) return;

    try {
      const resolved = new URL(rawHref, origin);
      if (resolved.origin !== origin || resolved.hash) return;
      const cleanUrl = resolved.href.replace(/\/$/, "");
      if (cleanUrl === origin || seen.has(cleanUrl)) return;
      seen.add(cleanUrl);
      pages.push({ label, href: resolved.href });
    } catch {}
  });

  const topPages = pages.slice(0, 12);
  const linksSection = topPages.length
    ? topPages.map((p) => `- [${p.label}](${p.href})`).join("\n")
    : `- [Home](${origin})`;

  return `# ${title}\n\n> ${desc}\n\n## Key Pages\n\n${linksSection}\n`;
}

import type { SubAgent } from "../types.js";

export const llmsSubAgent: SubAgent = async (ctx) => {
  const title = ctx.$("title").text().trim() || new URL(ctx.url).hostname;
  const desc =
    ctx.$('meta[name="description"]').attr("content")?.trim() ||
    "Core services, documentation, and company overview.";

  const seen = new Set<string>();
  const links: { label: string; href: string }[] = [];

  ctx.$("a[href]").each((_, el) => {
    const raw = ctx.$(el).attr("href")?.trim();
    const label = ctx.$(el).text().replace(/\s+/g, " ").trim();
    if (!raw || !label || label.length < 2 || label.length > 65) return;

    try {
      const resolved = new URL(raw, ctx.origin);
      if (resolved.origin !== ctx.origin || resolved.hash) return;
      const clean = resolved.href.replace(/\/$/, "");
      if (clean === ctx.origin || seen.has(clean)) return;
      seen.add(clean);
      links.push({ label, href: resolved.href });
    } catch {}
  });

  const sections = ctx
    .$("h2")
    .map((_, el) => ctx.$(el).text().trim())
    .get()
    .filter((t) => t.length > 2 && t.length < 80)
    .slice(0, 8);

  const llmsContent = [
    `# ${title}`,
    ``,
    `> ${desc}`,
    ``,
    `## Core Capabilities & Topics`,
    ...(sections.length
      ? sections.map((s) => `- ${s}`)
      : [`- Primary offerings and solutions at ${ctx.origin}`]),
    ``,
    `## Key Pages`,
    ...(links.length
      ? links.slice(0, 15).map((l) => `- [${l.label}](${l.href})`)
      : [`- [Homepage](${ctx.origin})`]),
    ``,
  ].join("\n");

  return {
    agentName: "LLM Context & GEO Sub-Agent",
    role: "Generative Engine Optimization (GEO) Specialist",
    summary: `Built a structured /llms.txt index with ${links.slice(0, 15).length} canonical internal routes.`,
    actionsTaken: [
      "Formatted brand summary blockquote for zero-shot LLM ingestion",
      `Indexed ${sections.length} core H2 topic pillars and ${links.slice(0, 15).length} internal URLs`,
    ],
    artifacts: [
      {
        filename: "llms.txt",
        description: "Deploy to your website root (/llms.txt)",
        content: llmsContent,
      },
    ],
  };
};

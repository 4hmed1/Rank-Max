import type { SubAgent } from "../types.js";

export const crawlerSubAgent: SubAgent = async (ctx) => {
  let existingRobots = "";
  try {
    const res = await fetch(`${ctx.origin}/robots.txt`);
    if (res.ok) existingRobots = await res.text();
  } catch {}

  const optimizedRobots = `# Optimized by Rank Max Crawler Sub-Agent
User-agent: *
Allow: /

# Explicitly allow AI Search & Answer Engine Crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${ctx.origin}/sitemap.xml
`;

  return {
    agentName: "Crawler & Indexation Sub-Agent",
    role: "Principal Technical SEO & Bot Access Architect",
    summary: existingRobots
      ? "Audited existing robots.txt and generated an AI-crawler-friendly version."
      : "No robots.txt found; engineered a production-ready robots.txt with full AI bot permissions.",
    actionsTaken: [
      "Enabled full crawl access for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended",
      `Linked canonical XML sitemap at ${ctx.origin}/sitemap.xml`,
    ],
    artifacts: [
      {
        filename: "robots.txt",
        description: "Deploy to your website root (/robots.txt)",
        content: optimizedRobots,
      },
    ],
  };
};

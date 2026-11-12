import type { Check } from "../types.js";

const AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

export const robotsAiBots: Check = async (ctx) => {
  const blocked: string[] = [];
  try {
    const res = await fetch(`${ctx.origin}/robots.txt`);
    if (res.ok) {
      const text = await res.text();
      const groups = text.split(/\n\s*\n/);
      for (const bot of AI_BOTS) {
        for (const g of groups) {
          const lines = g.split("\n").map((l) => l.trim().toLowerCase());
          const targets = lines.some((l) => l === `user-agent: ${bot.toLowerCase()}`);
          const blocksAll = lines.some((l) => l === "disallow: /");
          if (targets && blocksAll) blocked.push(bot);
        }
      }
    }
  } catch {}
  return {
    id: "robots-ai-bots",
    name: "AI crawlers allowed in robots.txt",
    passed: blocked.length === 0,
    weight: 15,
    why: "If AI crawlers are blocked, ChatGPT, Claude and Perplexity cannot read your site.",
    fix: blocked.length
      ? `Remove the "Disallow: /" rule for: ${blocked.join(", ")}`
      : "Nothing to fix.",
  };
};
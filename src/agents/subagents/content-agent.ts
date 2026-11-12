import type { SubAgent } from "../types.js";

export const contentSubAgent: SubAgent = async (ctx) => {
  const currentTitle = ctx.$("title").text().trim() || new URL(ctx.url).hostname;
  const currentDesc =
    ctx.$('meta[name="description"]').attr("content")?.trim() ||
    `${currentTitle} — Official website, services, and resources.`;
  const ogImage =
    ctx.$('meta[property="og:image"]').attr("content")?.trim() ||
    `${ctx.origin}/og-image.png`;
  const h1Count = ctx.$("h1").length;

  const headSnippet = `<!-- Optimized Meta, Canonical & Open Graph by Rank Max Content Sub-Agent -->
<title>${currentTitle}</title>
<meta name="description" content="${currentDesc.replace(/"/g, "&quot;")}" />
<link rel="canonical" href="${ctx.url}" />

<!-- Open Graph / AI Citation Card Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${ctx.url}" />
<meta property="og:title" content="${currentTitle.replace(/"/g, "&quot;")}" />
<meta property="og:description" content="${currentDesc.replace(/"/g, "&quot;")}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
`;

  const actions = [
    "Generated canonical, meta description, and Open Graph citation card tags",
  ];
  if (h1Count !== 1) {
    actions.push(
      `Flagged H1 hierarchy issue: found ${h1Count} <h1> tags (enforce strictly 1 primary <h1>)`
    );
  } else {
    actions.push("Verified single semantic <h1> tag structure");
  }

  return {
    agentName: "AEO Content & Meta Sub-Agent",
    role: "Answer Engine Copywriter & Semantic HTML Architect",
    summary: "Engineered complete meta/OG head tags and audited semantic heading structure.",
    actionsTaken: actions,
    artifacts: [
      {
        filename: "meta-og-head-snippet.html",
        description: "Paste inside your page <head> tag",
        content: headSnippet,
      },
    ],
  };
};

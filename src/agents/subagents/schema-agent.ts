import type { SubAgent } from "../types.js";

export const schemaSubAgent: SubAgent = async (ctx) => {
  const siteName =
    ctx.$('meta[property="og:site_name"]').attr("content")?.trim() ||
    ctx.$("title").text().split("|")[0].trim() ||
    new URL(ctx.url).hostname;

  const description =
    ctx.$('meta[name="description"]').attr("content")?.trim() ||
    "Official website.";

  const image =
    ctx.$('meta[property="og:image"]').attr("content")?.trim() ||
    `${ctx.origin}/og-image.png`;

  const socialLinks = ctx
    .$("a[href]")
    .map((_, el) => ctx.$(el).attr("href") || "")
    .get()
    .filter((href) =>
      /(linkedin\.com|github\.com|twitter\.com|x\.com|youtube\.com|instagram\.com|facebook\.com)/i.test(
        href
      )
    );

  // Extract Q&A pairs from question headings + next paragraph
  const faqEntities: Record<string, unknown>[] = [];
  ctx.$("h2, h3").each((_, el) => {
    const q = ctx.$(el).text().trim();
    const a = ctx.$(el).next("p").text().trim();
    if ((q.endsWith("?") || /^(what|how|why|can|does|is|where)/i.test(q)) && a.length > 20) {
      faqEntities.push({
        "@type": "Question",
        name: q,
        acceptedAnswer: {
          "@type": "Answer",
          text: a,
        },
      });
    }
  });

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${ctx.origin}/#website`,
      url: ctx.origin,
      name: siteName,
      description,
    },
    {
      "@type": "Organization",
      "@id": `${ctx.origin}/#organization`,
      name: siteName,
      url: ctx.origin,
      logo: image,
      sameAs: [...new Set(socialLinks)],
    },
  ];

  if (faqEntities.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${ctx.url}#faq`,
      mainEntity: faqEntities,
    });
  }

  const schemaScript = `<script type="application/ld+json">\n${JSON.stringify(
    { "@context": "https://schema.org", "@graph": graph },
    null,
    2
  )}\n</script>\n`;

  return {
    agentName: "Knowledge Graph & Schema Sub-Agent",
    role: "Principal Structured Data & Entity Engineer",
    summary: `Synthesized WebSite, Organization, and ${faqEntities.length ? "FAQPage" : "entity"} JSON-LD schema.`,
    actionsTaken: [
      `Constructed @graph schema for entity "${siteName}"`,
      `Mapped ${[...new Set(socialLinks)].length} authoritative sameAs profile link(s)`,
      `Extracted ${faqEntities.length} structured FAQ Q&A pair(s) from page DOM`,
    ],
    artifacts: [
      {
        filename: "schema-head-snippet.html",
        description: "Paste inside your page <head> tag",
        content: schemaScript,
      },
    ],
  };
};

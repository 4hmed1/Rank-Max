import type { Check } from "../types.js";

const VALUABLE_TYPES = [
  "Organization",
  "LocalBusiness",
  "FAQPage",
  "Article",
  "BlogPosting",
  "Product",
  "SoftwareApplication",
  "WebSite",
  "Service",
];

export const jsonLd: Check = async (ctx) => {
  const scripts = ctx.$('script[type="application/ld+json"]');
  const validTypes: string[] = [];
  let parseErrors = 0;

  scripts.each((_, el) => {
    try {
      const raw = ctx.$(el).html() || "";
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed)
        ? parsed
        : parsed["@graph"]
        ? parsed["@graph"]
        : [parsed];

      for (const item of items) {
        const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
        for (const t of types) {
          if (typeof t === "string") validTypes.push(t);
        }
      }
    } catch {
      parseErrors++;
    }
  });

  const hasValuable = validTypes.some((t) => VALUABLE_TYPES.includes(t));
  const passed = validTypes.length > 0 && parseErrors === 0 && hasValuable;

  return {
    id: "json-ld",
    name: `Valid JSON-LD entities (${validTypes.length ? [...new Set(validTypes)].join(", ") : "none"})`,
    passed,
    weight: 15,
    why: "Valid Schema.org entities prevent AI hallucinations and establish your brand in knowledge graphs.",
    fix: parseErrors > 0
      ? `Fix ${parseErrors} invalid JSON-LD syntax error(s) on the page.`
      : "Add valid Organization, LocalBusiness, or FAQPage JSON-LD schema.",
  };
};

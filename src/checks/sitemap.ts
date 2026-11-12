import type { Check } from "../types.js";

export const sitemapCheck: Check = async (ctx) => {
  let ok = false;
  try {
    const res = await fetch(`${ctx.origin}/sitemap.xml`);
    const text = res.ok ? await res.text() : "";
    ok = res.ok && (text.includes("<urlset") || text.includes("<sitemapindex"));
  } catch {}
  return {
    id: "sitemap",
    name: "XML Sitemap accessible at /sitemap.xml",
    passed: ok,
    weight: 10,
    why: "Sitemaps help search and AI crawlers discover deep pages without missing content.",
    fix: "Generate and serve a valid /sitemap.xml file at your domain root.",
  };
};

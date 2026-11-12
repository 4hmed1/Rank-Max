import type { Check } from "../types.js";

export const metaBasics: Check = async (ctx) => {
  const title = ctx.$("title").text().trim();
  const desc = ctx.$('meta[name="description"]').attr("content")?.trim() ?? "";
  const canonical = ctx.$('link[rel="canonical"]').attr("href")?.trim() ?? "";

  const missing: string[] = [];
  if (title.length < 10) missing.push("meaningful <title>");
  if (desc.length < 50) missing.push("meta description (50+ chars)");
  if (!canonical) missing.push("canonical link tag");

  return {
    id: "meta-basics",
    name: "Title, meta description, and canonical tag present",
    passed: missing.length === 0,
    weight: 15,
    why: "LLMs and search engines rely on titles, descriptions, and canonical URLs to cite the right source.",
    fix: missing.length ? `Add or improve: ${missing.join(", ")}.` : "Nothing to fix.",
  };
};

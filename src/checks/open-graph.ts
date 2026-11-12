import type { Check } from "../types.js";

export const openGraphCheck: Check = async (ctx) => {
  const ogTitle = ctx.$('meta[property="og:title"]').attr("content")?.trim();
  const ogDesc = ctx.$('meta[property="og:description"]').attr("content")?.trim();
  const ogImage = ctx.$('meta[property="og:image"]').attr("content")?.trim();

  const missing: string[] = [];
  if (!ogTitle) missing.push("og:title");
  if (!ogDesc) missing.push("og:description");
  if (!ogImage) missing.push("og:image");

  return {
    id: "open-graph",
    name: "Open Graph citation metadata complete",
    passed: missing.length === 0,
    weight: 10,
    why: "AI answer engines use Open Graph tags to display visual citation cards and source previews.",
    fix: missing.length ? `Add missing Open Graph tags: ${missing.join(", ")}.` : "Nothing to fix.",
  };
};

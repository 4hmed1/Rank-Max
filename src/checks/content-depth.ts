import type { Check } from "../types.js";

export const contentDepthCheck: Check = async (ctx) => {
  const clone = ctx.$.load(ctx.html);
  clone("script, style, noscript").remove();
  const text = clone("body").text().replace(/\s+/g, " ").trim();
  const wordCount = text ? text.split(" ").length : 0;

  return {
    id: "content-depth",
    name: "Substantial crawlable HTML text (150+ words)",
    passed: wordCount >= 150,
    weight: 10,
    why: "Many AI bots do not execute heavy client-side JS; thin HTML means your page looks blank to them.",
    fix: `Increase server-rendered text content on the page (currently ${wordCount} words).`,
  };
};

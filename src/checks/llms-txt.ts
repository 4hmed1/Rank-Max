import type { Check } from "../types.js";

export const llmsTxt: Check = async (ctx) => {
  let ok = false;
  try {
    const res = await fetch(`${ctx.origin}/llms.txt`);
    const text = res.ok ? await res.text() : "";
    ok = res.ok && text.trim().startsWith("#");
  } catch {}
  return {
    id: "llms-txt",
    name: "llms.txt file exists",
    passed: ok,
    weight: 10,
    why: "llms.txt gives AI systems a clean summary of your site and its key pages.",
    fix: "Create /llms.txt starting with a # title, a short description, and links to key pages.",
  };
};
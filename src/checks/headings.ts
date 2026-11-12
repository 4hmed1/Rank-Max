import type { Check } from "../types.js";

export const headingsCheck: Check = async (ctx) => {
  const h1Count = ctx.$("h1").length;
  const h2Count = ctx.$("h2").length;
  const passed = h1Count === 1 && h2Count >= 1;

  return {
    id: "headings",
    name: "Clean semantic heading hierarchy (1 H1 + H2s)",
    passed,
    weight: 15,
    why: "Clear H1 and H2 sections allow Answer Engines to extract direct answers to user questions.",
    fix:
      h1Count !== 1
        ? `Use exactly one <h1> tag per page (found ${h1Count}).`
        : "Add descriptive <h2> subheadings to structure your content.",
  };
};

import type { Check } from "../types.js";

export const faqStructureCheck: Check = async (ctx) => {
  const candidates = ctx.$("h2, h3, summary, button, [role='button']")
    .map((_, el) => ctx.$(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter((t) => t.length >= 10 && t.length <= 140);

  const uniqueQuestions = new Set(
    candidates.filter(
      (t) =>
        t.endsWith("?") ||
        /^(what|how|why|when|where|who|which|can|does|is|are|should|do)\b/i.test(t)
    )
  );

  const hasFaqSchema = ctx.html.includes('"FAQPage"');
  const count = uniqueQuestions.size;
  const passed = count >= 2 || (count >= 1 && hasFaqSchema);

  return {
    id: "faq-structure",
    name: `Question-based Q&A headings & accordions (${count} found)`,
    passed,
    weight: 10,
    why: "Answer engines match user prompts directly against question-framed headings, accordions, and FAQPage schema.",
    fix: "Add at least 2 question-framed H2/H3/accordion items (e.g., 'How does X work?') paired with clear answers.",
  };
};

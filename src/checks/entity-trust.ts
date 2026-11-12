import type { Check } from "../types.js";

export const entityTrustCheck: Check = async (ctx) => {
  const links = ctx.$("a[href]")
    .map((_, el) => ctx.$(el).attr("href") || "")
    .get();

  const hasAboutOrContact = links.some((l) =>
    /(about|contact|company|team|work|services)/i.test(l)
  );
  const hasSocialOrContactSignal =
    ctx.html.includes("sameAs") ||
    links.some((l) =>
      /(linkedin\.com|github\.com|twitter\.com|x\.com|youtube\.com|instagram\.com|facebook\.com|mailto:|tel:)/i.test(
        l
      )
    );

  const passed = hasAboutOrContact && hasSocialOrContactSignal;

  return {
    id: "entity-trust",
    name: "Brand entity trust & verifiable contact/authority signals",
    passed,
    weight: 10,
    why: "Verifiable About/Contact routes, direct contact channels, and external brand profiles confirm E-E-A-T to AI systems.",
    fix: "Include clear links to /about or /contact and add official social profiles, mailto/tel links, or JSON-LD sameAs.",
  };
};

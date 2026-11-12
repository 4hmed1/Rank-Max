import type { Check } from "../types.js";

export const jsonLd: Check = async (ctx) => {
  const blocks = ctx.$('script[type="application/ld+json"]').length;
  return {
    id: "json-ld",
    name: "JSON-LD structured data present",
    passed: blocks > 0,
    weight: 15,
    why: "Schema markup tells AI exactly who you are, what you sell and where you are.",
    fix: "Add Organization or LocalBusiness JSON-LD to your homepage.",
  };
};
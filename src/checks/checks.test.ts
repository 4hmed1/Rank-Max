import { describe, it, expect } from "vitest";
import * as cheerio from "cheerio";
import type { PageContext } from "../types.js";
import { jsonLd } from "./json-ld.js";
import { metaBasics } from "./meta-basics.js";
import { headingsCheck } from "./headings.js";
import { contentDepthCheck } from "./content-depth.js";

function makeCtx(html: string): PageContext {
  return {
    url: "https://example.com",
    origin: "https://example.com",
    html,
    $: cheerio.load(html),
  };
}

describe("Rank Max AEO/GEO Checks", () => {
  it("passes JSON-LD when schema script exists", async () => {
    const res = await jsonLd(makeCtx('<script type="application/ld+json">{"@type":"Organization"}</script>'));
    expect(res.passed).toBe(true);
  });

  it("fails metaBasics when canonical or description is missing", async () => {
    const res = await metaBasics(makeCtx("<html><head><title>Short</title></head></html>"));
    expect(res.passed).toBe(false);
  });

  it("passes headingsCheck with 1 H1 and at least 1 H2", async () => {
    const res = await headingsCheck(makeCtx("<h1>Main Title</h1><h2>Section One</h2>"));
    expect(res.passed).toBe(true);
  });

  it("fails contentDepthCheck on thin pages", async () => {
    const res = await contentDepthCheck(makeCtx("<body><p>Hello world</p></body>"));
    expect(res.passed).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import * as cheerio from "cheerio";
import type { PageContext } from "../types.js";
import { crawlerSubAgent } from "./subagents/crawler-agent.js";
import { schemaSubAgent } from "./subagents/schema-agent.js";
import { llmsSubAgent } from "./subagents/llms-agent.js";
import { contentSubAgent } from "./subagents/content-agent.js";

function makeCtx(html: string): PageContext {
  return {
    url: "https://maxdigitalstudio.site",
    origin: "https://maxdigitalstudio.site",
    html,
    $: cheerio.load(html),
  };
}

describe("Rank Max Multi-Agent System", () => {
  const sampleHtml = `
    <html>
      <head>
        <title>Max Digital Studio | SEO & AEO Agency</title>
        <meta name="description" content="We build fast websites engineered to rank on Google and get recommended by ChatGPT and Perplexity." />
      </head>
      <body>
        <h1>We build brands that rank, render, and convert.</h1>
        <h2>What is AEO?</h2>
        <p>Answer Engine Optimization structures your site so AI models cite your brand directly.</p>
        <a href="/services">Services</a>
        <a href="https://linkedin.com">LinkedIn</a>
      </body>
    </html>
  `;

  it("Crawler Sub-Agent generates AI-friendly robots.txt", async () => {
    const rep = await crawlerSubAgent(makeCtx(sampleHtml));
    expect(rep.artifacts[0].filename).toBe("robots.txt");
    expect(rep.artifacts[0].content).toContain("User-agent: GPTBot");
    expect(rep.artifacts[0].content).toContain("User-agent: PerplexityBot");
  });

  it("Schema Sub-Agent extracts FAQPage and Organization JSON-LD", async () => {
    const rep = await schemaSubAgent(makeCtx(sampleHtml));
    expect(rep.artifacts[0].filename).toBe("schema-head-snippet.html");
    expect(rep.artifacts[0].content).toContain("FAQPage");
    expect(rep.artifacts[0].content).toContain("linkedin.com");
  });

  it("LLM Context Sub-Agent generates structured llms.txt", async () => {
    const rep = await llmsSubAgent(makeCtx(sampleHtml));
    expect(rep.artifacts[0].filename).toBe("llms.txt");
    expect(rep.artifacts[0].content).toContain("# Max Digital Studio");
    expect(rep.artifacts[0].content).toContain("/services");
  });

  it("Content Sub-Agent builds canonical and Open Graph snippet", async () => {
    const rep = await contentSubAgent(makeCtx(sampleHtml));
    expect(rep.artifacts[0].filename).toBe("meta-og-head-snippet.html");
    expect(rep.artifacts[0].content).toContain('rel="canonical"');
    expect(rep.artifacts[0].content).toContain('property="og:title"');
  });
});

import * as cheerio from "cheerio";
import type { CheckResult, PageContext } from "./types.js";
import { robotsAiBots } from "./checks/robots-ai-bots.js";
import { llmsTxt } from "./checks/llms-txt.js";
import { jsonLd } from "./checks/json-ld.js";
import { sitemapCheck } from "./checks/sitemap.js";
import { metaBasics } from "./checks/meta-basics.js";
import { headingsCheck } from "./checks/headings.js";
import { openGraphCheck } from "./checks/open-graph.js";
import { contentDepthCheck } from "./checks/content-depth.js";
import { faqStructureCheck } from "./checks/faq-structure.js";
import { entityTrustCheck } from "./checks/entity-trust.js";

const checks = [
  robotsAiBots,
  llmsTxt,
  jsonLd,
  sitemapCheck,
  metaBasics,
  headingsCheck,
  openGraphCheck,
  contentDepthCheck,
  faqStructureCheck,
  entityTrustCheck,
];

export async function scan(input: string) {
  const url = input.startsWith("http") ? input : `https://${input}`;
  const start = Date.now();
  const res = await fetch(url, { headers: { "User-Agent": "RankMax/0.3" } });
  const html = await res.text();
  const responseTimeMs = Date.now() - start;

  const ctx: PageContext = {
    url,
    origin: new URL(url).origin,
    html,
    $: cheerio.load(html),
  };

  const results: CheckResult[] = await Promise.all(checks.map((c) => c(ctx)));
  const total = results.reduce((s, r) => s + r.weight, 0);
  const earned = results.filter((r) => r.passed).reduce((s, r) => s + r.weight, 0);
  const score = Math.round((earned / total) * 100);
  const grade =
    score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";

  return { url, score, grade, responseTimeMs, results };
}

import * as cheerio from "cheerio";
import type { CheckResult, PageContext } from "./types.js";
import { robotsAiBots } from "./checks/robots-ai-bots.js";
import { llmsTxt } from "./checks/llms-txt.js";
import { jsonLd } from "./checks/json-ld.js";

const checks = [robotsAiBots, llmsTxt, jsonLd];

export async function scan(input: string) {
  const url = input.startsWith("http") ? input : `https://${input}`;
  const res = await fetch(url, { headers: { "User-Agent": "RankMax/0.1" } });
  const html = await res.text();
  const ctx: PageContext = {
    url,
    origin: new URL(url).origin,
    html,
    $: cheerio.load(html),
  };

  const results: CheckResult[] = await Promise.all(checks.map((c) => c(ctx)));
  const total = results.reduce((s, r) => s + r.weight, 0);
  const earned = results.filter((r) => r.passed).reduce((s, r) => s + r.weight, 0);
  return { url, score: Math.round((earned / total) * 100), results };
}
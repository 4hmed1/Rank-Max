import * as cheerio from "cheerio";
import { scan } from "./scan.js";

export interface CrawledPageSummary {
  url: string;
  status: number;
  score: number;
  grade: string;
  title: string;
  failingChecks: string[];
}

export async function crawlSite(entryUrl: string, maxPages = 10) {
  const startUrl = entryUrl.startsWith("http") ? entryUrl : `https://${entryUrl}`;
  const origin = new URL(startUrl).origin;
  const discovered = new Set<string>([startUrl.replace(/\/$/, "")]);

  // 1. Seed URLs from /sitemap.xml if available
  try {
    const smRes = await fetch(`${origin}/sitemap.xml`);
    if (smRes.ok) {
      const xml = await smRes.text();
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => m[1].trim());
      for (const loc of locs) {
        if (loc.startsWith(origin)) discovered.add(loc.replace(/\/$/, ""));
      }
    }
  } catch {}

  // 2. Discover internal links from homepage
  try {
    const homeRes = await fetch(startUrl);
    const homeHtml = await homeRes.text();
    const $ = cheerio.load(homeHtml);
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      try {
        const u = new URL(href, origin);
        if (u.origin === origin && !u.hash && !/\.(png|jpg|jpeg|svg|pdf|zip|webp)$/i.test(u.pathname)) {
          discovered.add(u.href.replace(/\/$/, ""));
        }
      } catch {}
    });
  } catch {}

  const targets = [...discovered].slice(0, maxPages);
  const pages: CrawledPageSummary[] = [];
  const brokenLinks: { url: string; status: number }[] = [];

  for (const target of targets) {
    try {
      const checkRes = await fetch(target, { method: "HEAD" });
      if (checkRes.status >= 400) {
        brokenLinks.push({ url: target, status: checkRes.status });
        continue;
      }
      const report = await scan(target);
      const htmlRes = await fetch(target);
      const $ = cheerio.load(await htmlRes.text());
      pages.push({
        url: target,
        status: checkRes.status,
        score: report.score,
        grade: report.grade,
        title: $("title").text().trim() || "(No title)",
        failingChecks: report.results.filter((r) => !r.passed).map((r) => r.name),
      });
    } catch {
      brokenLinks.push({ url: target, status: 0 });
    }
  }

  const avgScore = pages.length
    ? Math.round(pages.reduce((sum, p) => sum + p.score, 0) / pages.length)
    : 0;

  return {
    origin,
    pagesScanned: pages.length,
    avgScore,
    brokenLinks,
    pages: pages.sort((a, b) => a.score - b.score),
  };
}

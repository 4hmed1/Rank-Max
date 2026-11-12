#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { Command } from "commander";
import pc from "picocolors";
import { scan } from "./scan.js";
import { generateLlmsTxt } from "./generate.js";
import { runAgentPipeline } from "./agents/orchestrator.js";
import { crawlSite } from "./crawler.js";
import { simulateAiCitation } from "./simulator.js";
import { buildHtmlDashboard } from "./html-report.js";

const program = new Command();
program
  .name("rankmax")
  .description("Enterprise SEO · AEO · GEO Auditing, Simulation & Multi-Agent Optimization Engine")
  .version("1.0.0");

program
  .command("scan <url>")
  .description("Audit a URL for AI search readiness")
  .option("--json", "Output raw JSON")
  .option("--export <file>", "Export a Markdown audit report")
  .option("--html <file>", "Export a standalone interactive HTML visual dashboard")
  .option("--min-score <number>", "Exit with code 1 if score is below threshold")
  .action(
    async (
      url: string,
      opts: { json?: boolean; export?: string; html?: string; minScore?: string }
    ) => {
      try {
        const report = await scan(url);

        if (opts.export) {
          const md = [
            `# Rank Max AI-Readiness Report`,
            `- **URL:** ${report.url}`,
            `- **Score:** ${report.score}/100 (Grade: **${report.grade}**)`,
            `- **Fetch Time:** ${report.responseTimeMs}ms\n`,
            `## Audit Breakdown\n`,
            ...report.results.map(
              (r) =>
                `### ${r.passed ? "✅" : "❌"} ${r.name} (${r.weight} pts)\n- **Why:** ${r.why}\n- **Fix:** ${r.fix}\n`
            ),
          ].join("\n");
          writeFileSync(opts.export, md, "utf8");
          console.log(pc.cyan(`Saved Markdown report to ${opts.export}`));
        }

        if (opts.html) {
          writeFileSync(opts.html, buildHtmlDashboard(report), "utf8");
          console.log(pc.cyan(`Saved Executive HTML Dashboard to ${opts.html}`));
        }

        if (opts.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          const scoreColor =
            report.score >= 80 ? pc.green : report.score >= 55 ? pc.yellow : pc.red;

          console.log(`\n${pc.bold("Rank Max")}  ${report.url} ${pc.dim(`(${report.responseTimeMs}ms)`)}`);
          console.log(
            `AI-readiness score: ${scoreColor(pc.bold(`${report.score}/100`))}  Grade: ${pc.bold(report.grade)}\n`
          );

          for (const r of report.results) {
            console.log(`${r.passed ? pc.green("✔") : pc.red("✘")} ${r.name} ${pc.dim(`[${r.weight}pts]`)}`);
            if (!r.passed) {
              console.log(pc.dim(`   Why: ${r.why}`));
              console.log(pc.yellow(`   Fix: ${r.fix}`));
            }
          }
          console.log();
        }

        if (opts.minScore && report.score < Number(opts.minScore)) {
          console.error(pc.red(`Score ${report.score} is below minimum threshold ${opts.minScore}.`));
          process.exit(1);
        }
      } catch (err) {
        console.error(pc.red(`Could not scan ${url}: ${(err as Error).message}`));
        process.exit(1);
      }
    }
  );

program
  .command("crawl <url>")
  .description("Deep-crawl an entire website via sitemap & internal links to find weak/broken pages")
  .option("-m, --max <number>", "Maximum pages to crawl", "10")
  .action(async (url: string, opts: { max: string }) => {
    try {
      console.log(`\n${pc.bold(pc.cyan("🕷️  Rank Max Deep Site Crawler"))} scanning ${url}...\n`);
      const summary = await crawlSite(url, Number(opts.max));
      console.log(
        `Pages Audited: ${pc.bold(String(summary.pagesScanned))}  |  Site-Wide Avg Score: ${pc.bold(`${summary.avgScore}/100`)}  |  Broken Links: ${summary.brokenLinks.length ? pc.red(String(summary.brokenLinks.length)) : pc.green("0")}\n`
      );
      for (const p of summary.pages) {
        const badge = p.score >= 80 ? pc.green(`${p.score}/100`) : p.score >= 55 ? pc.yellow(`${p.score}/100`) : pc.red(`${p.score}/100`);
        console.log(`${badge} (${p.grade})  ${p.url}`);
        if (p.failingChecks.length) {
          console.log(pc.dim(`   Needs fix: ${p.failingChecks.join(", ")}`));
        }
      }
      if (summary.brokenLinks.length) {
        console.log(pc.red("\nBroken Internal URLs:"));
        for (const b of summary.brokenLinks) console.log(`  ✘ [${b.status}] ${b.url}`);
      }
      console.log();
    } catch (err) {
      console.error(pc.red(`Crawl failed: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program
  .command("simulate <url>")
  .description("Simulate how ChatGPT, Perplexity & AI Overviews extract and cite your page")
  .action(async (url: string) => {
    try {
      const sim = await simulateAiCitation(url);
      console.log(`\n${pc.bold(pc.magenta("🧠 Rank Max AI Citation Simulator"))}  ${sim.url}\n`);
      console.log(`Primary Entity Topic: ${pc.bold(sim.primaryEntityTopic)}`);
      console.log(`AI Citation Probability: ${pc.bold(pc.cyan(`${sim.citationProbability}%`))}\n`);

      console.log(pc.bold("Top Quotable Passages Extracted for LLMs:"));
      if (sim.citableSnippets.length) {
        sim.citableSnippets.forEach((s, i) => console.log(pc.green(`  ${i + 1}. "${s}"`)));
      } else {
        console.log(pc.yellow("  None found — add clear definitional statements and statistics."));
      }

      if (sim.blindSpots.length) {
        console.log(pc.bold("\nAI Retrieval Blind Spots:"));
        sim.blindSpots.forEach((b) => console.log(pc.red(`  ✘ ${b}`)));
      }
      console.log();
    } catch (err) {
      console.error(pc.red(`Simulation failed: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program
  .command("compare <urlA> <urlB>")
  .description("Compare AI-readiness between two websites")
  .action(async (urlA: string, urlB: string) => {
    try {
      const [a, b] = await Promise.all([scan(urlA), scan(urlB)]);
      console.log(`\n${pc.bold("Rank Max Head-to-Head Comparison")}\n`);
      console.log(`${pc.cyan(a.url)}: ${pc.bold(`${a.score}/100`)} (${a.grade})`);
      console.log(`${pc.magenta(b.url)}: ${pc.bold(`${b.score}/100`)} (${b.grade})\n`);

      for (let i = 0; i < a.results.length; i++) {
        const ra = a.results[i];
        const rb = b.results[i];
        const markA = ra.passed ? pc.green("✔") : pc.red("✘");
        const markB = rb.passed ? pc.green("✔") : pc.red("✘");
        console.log(`${markA} vs ${markB}  ${ra.name}`);
      }
      console.log();
    } catch (err) {
      console.error(pc.red(`Comparison failed: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program
  .command("agent <url>")
  .description("Deploy Lead Agent & 4 Sub-Agents to generate a 100% SEO/AEO/GEO fix pack")
  .option("-o, --out <dir>", "Output directory for generated production files", "rankmax-fix-pack")
  .action(async (url: string, opts: { out: string }) => {
    try {
      console.log(`\n${pc.bold(pc.cyan("🤖 Rank Max Lead Orchestrator"))} initialized for ${pc.underline(url)}`);
      console.log(pc.dim("Dispatching 4 Senior Sub-Agents in parallel...\n"));

      const { baseline, reports, outDir } = await runAgentPipeline(url, opts.out);

      console.log(
        `Baseline Audit: ${pc.bold(`${baseline.score}/100`)} (${baseline.grade}) → Target: ${pc.green(pc.bold("100/100 (A+)"))}`
      );
      console.log();

      for (const rep of reports) {
        console.log(`${pc.green("✔")} ${pc.bold(rep.agentName)} ${pc.dim(`[${rep.role}]`)}`);
        console.log(`  ${rep.summary}`);
        for (const art of rep.artifacts) {
          console.log(pc.cyan(`  → Generated: ${outDir}/${art.filename}`));
        }
      }

      console.log(
        `\n${pc.green(pc.bold("✨ Complete!"))} Open ${pc.bold(`${outDir}/DEPLOYMENT-PLAYBOOK.md`)} for full deployment instructions.\n`
      );
    } catch (err) {
      console.error(pc.red(`Agent pipeline failed: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program
  .command("init <url>")
  .description("Auto-generate a starter llms.txt file from a live website")
  .option("-o, --out <file>", "Output filename", "llms.txt")
  .action(async (url: string, opts: { out: string }) => {
    try {
      const content = await generateLlmsTxt(url);
      writeFileSync(opts.out, content, "utf8");
      console.log(pc.green(`✔ Generated ${opts.out} from ${url}`));
    } catch (err) {
      console.error(pc.red(`Failed to generate llms.txt: ${(err as Error).message}`));
      process.exit(1);
    }
  });

program.parse();

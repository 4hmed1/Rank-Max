#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { scan } from "./scan.js";

const program = new Command();
program.name("rankmax").description("Is your site ready for AI search?").version("0.1.0");

program
  .command("scan <url>")
  .option("--json", "output JSON")
  .action(async (url: string, opts: { json?: boolean }) => {
    try {
      const report = await scan(url);
      if (opts.json) return console.log(JSON.stringify(report, null, 2));

      console.log(`\n${pc.bold("Rank Max")}  ${report.url}`);
      console.log(`AI-readiness score: ${pc.bold(String(report.score))}/100\n`);
      for (const r of report.results) {
        console.log(`${r.passed ? pc.green("✔") : pc.red("✘")} ${r.name}`);
        if (!r.passed) {
          console.log(pc.dim(`   Why: ${r.why}`));
          console.log(pc.yellow(`   Fix: ${r.fix}`));
        }
      }
      console.log();
    } catch {
      console.error(pc.red(`Could not scan ${url}`));
      process.exit(1);
    }
  });

program.parse();
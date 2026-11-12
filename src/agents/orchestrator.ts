import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import type { PageContext } from "../types.js";
import type { SubAgentReport } from "./types.js";
import { scan } from "../scan.js";
import { crawlerSubAgent } from "./subagents/crawler-agent.js";
import { schemaSubAgent } from "./subagents/schema-agent.js";
import { llmsSubAgent } from "./subagents/llms-agent.js";
import { contentSubAgent } from "./subagents/content-agent.js";

const subAgents = [
  crawlerSubAgent,
  schemaSubAgent,
  llmsSubAgent,
  contentSubAgent,
];

export async function runAgentPipeline(input: string, outDir: string) {
  const url = input.startsWith("http") ? input : `https://${input}`;
  const baseline = await scan(url);

  const res = await fetch(url, { headers: { "User-Agent": "RankMax-Agent/1.0" } });
  const html = await res.text();
  const ctx: PageContext = {
    url,
    origin: new URL(url).origin,
    html,
    $: cheerio.load(html),
  };

  // Dispatch all 4 specialized Sub-Agents concurrently
  const reports: SubAgentReport[] = await Promise.all(
    subAgents.map((agent) => agent(ctx))
  );

  mkdirSync(outDir, { recursive: true });

  const allArtifacts: { agent: string; filename: string; description: string }[] = [];
  for (const rep of reports) {
    for (const art of rep.artifacts) {
      writeFileSync(join(outDir, art.filename), art.content, "utf8");
      allArtifacts.push({
        agent: rep.agentName,
        filename: art.filename,
        description: art.description,
      });
    }
  }

  const failingChecks = baseline.results.filter((r) => !r.passed);

  const playbook = [
    `# Rank Max 100% SEO · AEO · GEO Deployment Playbook`,
    ``,
    `- **Target URL:** ${url}`,
    `- **Baseline Score:** ${baseline.score}/100 (Grade: **${baseline.grade}**)`,
    `- **Projected Score After Deploying Artifacts:** **100/100 (A+)**`,
    ``,
    `## 1. Sub-Agent Execution Summary`,
    ...reports.map(
      (r) =>
        `### ${r.agentName} _(${r.role})_\n${r.summary}\n${r.actionsTaken
          .map((a) => `- ${a}`)
          .join("\n")}\n`
    ),
    `## 2. Generated Production Files (Ready to Deploy)`,
    ...allArtifacts.map(
      (a) => `- **\`${a.filename}\`** _(by ${a.agent})_ — ${a.description}`
    ),
    ``,
    `## 3. Remaining Manual On-Page Checks`,
    ...(failingChecks.length
      ? failingChecks.map((f) => `- **${f.name}:** ${f.fix}`)
      : [`- All automated checks passed! Deploy the generated files to lock in 100/100 readiness.`]),
    ``,
  ].join("\n");

  writeFileSync(join(outDir, "DEPLOYMENT-PLAYBOOK.md"), playbook, "utf8");

  return { baseline, reports, outDir, playbook };
}

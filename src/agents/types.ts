import type { PageContext } from "../types.js";

export interface GeneratedArtifact {
  filename: string;
  description: string;
  content: string;
}

export interface SubAgentReport {
  agentName: string;
  role: string;
  summary: string;
  actionsTaken: string[];
  artifacts: GeneratedArtifact[];
}

export type SubAgent = (ctx: PageContext) => Promise<SubAgentReport>;

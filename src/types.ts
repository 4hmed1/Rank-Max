import type { CheerioAPI } from "cheerio";

export interface PageContext {
  url: string;
  origin: string;
  html: string;
  $: CheerioAPI;
}

export interface CheckResult {
  id: string;
  name: string;
  passed: boolean;
  weight: number;
  why: string;
  fix: string;
}

export type Check = (ctx: PageContext) => Promise<CheckResult>;
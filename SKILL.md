---
name: rank-max
description: Audit websites for SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO), simulate AI citations, crawl sitemaps, and auto-generate production fix packs (robots.txt, llms.txt, JSON-LD schema, meta/Open Graph snippets).
---

# Rank Max — SEO · AEO · GEO Skill

Use this skill whenever the user asks to audit a website's SEO/AI-search readiness, check if ChatGPT/Perplexity/Claude can cite a site, simulate AI retrieval, compare competitors, or generate `llms.txt`, `robots.txt`, and JSON-LD schema fixes.

## Available CLI Commands

Ensure `rankmax` is installed (`npm install -g rankmax` or `npx rankmax`) and execute:

1. **Single-Page Audit:**
   ```bash
   npx rankmax scan <url>
   ```
2. **Deep Multi-Page Site Crawl:**
   ```bash
   npx rankmax crawl <url> --max 10
   ```
3. **AI Citation & LLM Passage Simulator:**
   ```bash
   npx rankmax simulate <url>
   ```
4. **Autonomous Multi-Agent Fix Pack Generator:**
   ```bash
   npx rankmax agent <url> --out ./rankmax-fix-pack
   ```
5. **Competitor Head-to-Head Comparison:**
   ```bash
   npx rankmax compare <urlA> <urlB>
   ```
6. **Generate `llms.txt` Only:**
   ```bash
   npx rankmax init <url> -o llms.txt
   ```

## Workflow for Fixing a User's Website
1. Run `npx rankmax scan <url> --json` to inspect failing checks.
2. Run `npx rankmax agent <url> --out ./rankmax-fix-pack` to generate ready-to-deploy `robots.txt`, `llms.txt`, `schema-head-snippet.html`, and `meta-og-head-snippet.html`.
3. Apply the generated files directly into the user's codebase or summarize the `DEPLOYMENT-PLAYBOOK.md` steps.

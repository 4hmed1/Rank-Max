<div align="center">

# ⚡ RANK MAX (`rankmax`)

**The Open-Source SEO · AEO · GEO Auditing, AI Citation Simulation & Multi-Agent Optimization Engine**

Make any website **100% machine-readable, citable, and recommended** across **ChatGPT Search, Perplexity, Claude, Google AI Overviews, and Traditional Search**.

[![TypeScript](https://shields.io)](https://typescriptlang.org)
[![Node.js](https://shields.io)](https://nodejs.org)
[![License: MIT](https://shields.io)](LICENSE)
[![Built by Max Digital Studio](https://shields.io)](https://maxdigitalstudio.site)

[Quick Start](#-quick-start) • [CLI Commands](#-cli-commands) • [Multi-Agent Architecture](#-multi-agent-auto-fix-engine) • [10-Point Audit Matrix](#-the-10-point-seo--aeo--geo-audit-matrix) • [CI/CD Integration](#-cicd-quality-gates)

</div>

---

## 🚀 Why Rank Max?

Search has fundamentally shifted from **10 blue links** to **AI-generated answers**. Traditional SEO tools check keyword density and backlinks—they don't tell you if `GPTBot` is blocked, if your `llms.txt` is missing, if your JSON-LD knowledge graph is broken, or whether LLMs can extract quotable facts from your DOM.

**Rank Max** bridges engineering and AI visibility in one zero-config CLI:
1. **Audits** any single page or entire sitemap across **10 technical SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO)** signals.
2. **Simulates** how Large Language Models chunk, retrieve, and cite your passages—exposing **AI Retrieval Blind Spots**.
3. **Deploys 4 Autonomous Sub-Agents** to auto-generate drop-in production fixes (`robots.txt`, `llms.txt`, JSON-LD `@graph` schema, meta/Open Graph snippets, and a deployment playbook).

---

## ✨ Core Capabilities

- **🎯 10-Point AI Search Readiness Audit (`rankmax scan`)**: Scores any URL from `0–100` (`A+` to `D`) with actionable engineering fixes.
- **🕷️ Multi-Page Deep Site Crawler (`rankmax crawl`)**: Discovers internal routes via `/sitemap.xml` and DOM anchors, audits every page, flags broken links (`4xx`/`5xx`), and ranks weakest pages.
- **🧠 AI Citation & LLM Retrieval Simulator (`rankmax simulate`)**: Emulates `GPTBot` retrieval to calculate **AI Citation Probability (%)**, extract top quotable passages, and detect structural blind spots.
- **🤖 Autonomous Multi-Agent Fix Engine (`rankmax agent`)**: Dispatches a **Lead Orchestrator + 4 Senior Sub-Agents** in parallel to generate a ready-to-deploy production fix pack.
- **⚔️ Head-to-Head Competitor Benchmarking (`rankmax compare`)**: Compares two domains side-by-side across every SEO/AEO/GEO check.
- **📊 Executive HTML Visual Dashboards & CI Gates**: Export standalone dark-mode visual dashboards (`--html`), Markdown client reports (`--export`), or fail CI builds below a target score (`--min-score`).

---

## 📦 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/4hmed1/Rank-Max.git
cd rankmax
npm install
npm run build
```

### 2. Link Globally
```bash
npm link
```

### 3. Run Your First Audit
```bash
rankmax scan https://maxdigitalstudio.site
```

---

## 🛠️ CLI Commands

### `rankmax scan <url>` — Single-Page Deep Audit
Run a complete 10-point SEO/AEO/GEO audit, export a dark-mode Executive HTML Dashboard, or output JSON for automation:
```bash
# Standard terminal report
rankmax scan https://maxdigitalstudio.site

# Export an interactive dark-mode HTML visual dashboard
rankmax scan https://maxdigitalstudio.site --html report.html

# Export a client-ready Markdown report
rankmax scan https://maxdigitalstudio.site --export audit.md

# Raw JSON output
rankmax scan https://maxdigitalstudio.site --json
```

### `rankmax crawl <url>` — Multi-Page Site Crawler
Discover pages from `/sitemap.xml` and internal links, audit each route, and surface broken URLs:
```bash
rankmax crawl https://maxdigitalstudio.site --max 10
```

### `rankmax simulate <url>` — AI Citation & Passage Simulator
See what ChatGPT, Perplexity, and Google AI Overviews actually extract from your HTML:
```bash
rankmax simulate https://maxdigitalstudio.site
```

### `rankmax agent <url>` — Autonomous Multi-Agent Fix Pack
Deploy the Lead Orchestrator and 4 Senior Sub-Agents to generate production-ready fix files:
```bash
rankmax agent https://example.com --out ./rankmax-fix-pack
```

### `rankmax compare <urlA> <urlB>` — Competitor Benchmarking
Compare two websites side-by-side across all 10 readiness signals:
```bash
rankmax compare https://maxdigitalstudio.site https://example.com
```

### `rankmax init <url>` — Instant `llms.txt` Generator
Crawl any live domain and generate an `llmstxt.org`-compliant `/llms.txt` file:
```bash
rankmax init https://maxdigitalstudio.site -o llms.txt
```

---

## 🤖 Multi-Agent Auto-Fix Engine

When you run `rankmax agent <url>`, the **Lead Orchestrator** performs a baseline audit and dispatches **4 specialized Senior Sub-Agents** concurrently:

```text
                    ┌───────────────────────────────────┐
                    │     Lead Orchestrator Agent       │
                    │  (Baseline Audit & Playbook Gen)  │
                    └─────────────────┬─────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ Crawler Sub-Agent │       │ Schema Sub-Agent  │       │  LLMs Sub-Agent   │
│  → robots.txt     │       │  → JSON-LD @graph │       │  → llms.txt       │
└───────────────────┘       └───────────────────┘       └───────────────────┘
                                      │
                                      ▼
                            ┌───────────────────┐
                            │ Content Sub-Agent │
                            │  → Meta/OG <head> │
                            └───────────────────┘
```

| Sub-Agent | Specialty | Generated Production Artifact |
| :--- | :--- | :--- |
| **Crawler & Indexation Sub-Agent** | Technical SEO & AI Bot Permissions | `robots.txt` welcoming `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` |
| **Knowledge Graph & Schema Sub-Agent** | Structured Data & Entity Disambiguation | `schema-head-snippet.html` (`WebSite`, `Organization`, `sameAs`, and extracted `FAQPage` JSON-LD) |
| **LLM Context & GEO Sub-Agent** | Generative Engine Optimization (`llmstxt.org`) | `llms.txt` structured with brand summary, H2 topic pillars, and canonical internal routes |
| **AEO Content & Meta Sub-Agent** | Answer Engine Copy & Semantic HTML | `meta-og-head-snippet.html` with `<title>`, meta description, canonical tag, and Open Graph cards |
| **Lead Orchestrator** | Executive Deployment Synthesis | `DEPLOYMENT-PLAYBOOK.md` with step-by-step rollout instructions |

---

## 📊 The 10-Point SEO · AEO · GEO Audit Matrix

| # | Check ID | Weight | What It Verifies |
| :- | :--- | :-: | :--- |
| 1 | `robots-ai-bots` | **15 pts** | Ensures `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` are allowed in `/robots.txt` |
| 2 | `json-ld` | **15 pts** | Parses and validates Schema.org JSON-LD entities (`Organization`, `LocalBusiness`, `FAQPage`, `Article`, etc.) |
| 3 | `meta-basics` | **15 pts** | Verifies meaningful `<title>`, descriptive `<meta name="description">`, and `<link rel="canonical">` |
| 4 | `headings` | **15 pts** | Enforces clean semantic hierarchy (`1` primary `<h1>` + structured `<h2>` subheadings) |
| 5 | `llms-txt` | **10 pts** | Checks for a valid, Markdown-formatted `/llms.txt` file at the domain root |
| 6 | `sitemap` | **10 pts** | Confirms `/sitemap.xml` is accessible and serves valid `<urlset>` or `<sitemapindex>` XML |
| 7 | `open-graph` | **10 pts** | Validates `og:title`, `og:description`, and `og:image` for rich AI citation cards |
| 8 | `content-depth` | **10 pts** | Ensures 150+ words of server-rendered, crawlable HTML text (not an empty JS shell) |
| 9 | `faq-structure` | **10 pts** | Detects question-framed headings, accordions (`<summary>`/`<button>`), and `FAQPage` Q&A pairs |
| 10 | `entity-trust` | **10 pts** | Verifies `/about` or `/contact` trust routes, direct contact links, and external authority/social profiles |

---

## ⚙️ CI/CD Quality Gates

Prevent SEO/AEO regressions before deploying to production by adding **Rank Max** to your GitHub Actions workflow:

```yaml
- name: Audit AI Search Readiness
  run: npx rankmax scan https://your-staging-site.com --min-score 85
```

---

## 🧪 Running Tests

Rank Max includes an automated **Vitest** suite covering both the audit checks and the multi-agent artifact generators:

```bash
npm test -- --run
```

---

## 🏢 Built By

Engineered with ❤️ by **[Max Digital Studio](https://maxdigitalstudio.site)** — a digital growth and engineering studio specializing in high-performance web/app development, Technical SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO).

---

## 📄 License

• ### What is Rank Max? — Explain clearly in two sentences that it is an open-source TypeScript CLI that audits websites for ChatGPT, Perplexity, Claude, and Google AI Overviews.
• ### How do I check if ChatGPT or Perplexity can cite my website? — Show the exact npx rankmax simulate https://example.com and npx rankmax scan https://example.com commands.
• ### How do I auto-generate an llms.txt and JSON-LD schema? — Show the npx rankmax agent https://example.com command.


• Description: Enterprise SEO, AEO & GEO Auditing CLI, AI Citation Simulator & Multi-Agent Optimization Engine for ChatGPT, Perplexity & Google AI Overviews.
• Website: https://maxdigitalstudio.site
• Topics (Tags): Add seo, aeo, geo, llms-txt, ai-search, claude-skill, json-ld, cli, typescript, answer-engine-optimization, generative-engine-optimization.

GitHub and npm rank repositories higher in search results when an explicit LICENSE file (MIT) is present in the root directory. Create a file named LICENSE with the standard MIT license text credited to 2026 Muhammad Ahmed — Max Digital Studio.
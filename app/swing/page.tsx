"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const sections = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "whats-built", label: "What's Built" },
  { id: "repo-layout", label: "Repo Layout" },
  { id: "quick-start", label: "Quick Start" },
  { id: "rag-corpus", label: "RAG Corpus" },
  { id: "output-schemas", label: "Output Schemas" },
  { id: "eval-harness", label: "Eval Harness" },
  { id: "observability", label: "Observability" },
  { id: "model-routing", label: "Model Routing" },
]

const tools = [
  "Python",
  "LangGraph",
  "FastAPI",
  "Next.js",
  "Postgres",
  "Prometheus",
  "LangSmith",
  "Claude API",
  "EDGAR / FMP",
  "FRED",
  "Polygon.io",
]

function TableOfContents() {
  const [active, setActive] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="hidden lg:block fixed top-32 w-44" style={{ left: "max(1rem, calc(50% - 38rem))" }}>
      <ul className="space-y-1.5 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={`text-left transition-colors duration-200 ${
                active === s.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function SwingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-onest)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 mx-auto max-w-3xl">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </Link>
        <a
          href="https://github.com/shaoming11/swing-trader"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          GitHub
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </header>

      {/* Title */}
      <div className="text-center mt-4">
        <h1 className="text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-onest)" }}>Swing</h1>
        <p className="mt-2 text-muted-foreground">Project, 2026</p>
      </div>

      {/* Hero image */}
      <div className="mt-10 mx-auto max-w-4xl px-6">
        <Image
          src="/projects/swing.png"
          alt="Swing Trader AI"
          width={1200}
          height={600}
          className="w-full object-cover"
        />
      </div>

      {/* Meta: Timeline + Tools | Overview */}
      <div className="mt-16 mx-auto max-w-3xl px-6 grid grid-cols-1 gap-12 sm:grid-cols-2">
        <div>
          <h3 className="font-bold text-sm">Timeline</h3>
          <p className="mt-1 text-muted-foreground text-sm">4 Weeks, June - July 2026</p>

          <h3 className="mt-6 font-bold text-sm">Tools</h3>
          <ul className="mt-1 text-sm text-muted-foreground space-y-0.5">
            {tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-sm">Overview</h3>
          <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
            An AI-powered swing trade analysis pipeline. Given a ticker and a date window, it pulls structured financial data, retrieves and reranks relevant news/analyst/sentiment chunks via RAG, reasons over the context with multiple analyst personas, synthesizes a judge verdict, validates it through guardrails, and outputs a calibrated position card.
          </p>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            Check out the <a href="https://github.com/shaoming11/swing-trader" target="_blank" rel="noreferrer noopener" className="underline hover:text-foreground transition-colors">GitHub</a> to run the project locally.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <TableOfContents />

      {/* Content */}
      <article className="mt-20 mx-auto max-w-3xl px-6 pb-32">
        {/* Architecture */}
        <section id="overview" className="sr-only">
          <h2>Overview</h2>
        </section>

        <section id="architecture">
          <h2 className="text-2xl font-bold">Architecture</h2>
          <div className="mt-6 overflow-x-auto rounded bg-muted/50 p-4">
            <pre className="text-xs leading-relaxed font-mono text-muted-foreground">{`[Corpus Generator] ──► [Vector Store]
                              │
[Data Pull] ──────────────────┤
  fundamentals (EDGAR/FMP)    │
  macro (FRED)                ▼
                    [RAG Retrieval + Rerank]
                              │
                    [Prompt Composition]
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         [Bull]          [Bear]          [Macro]     [Technicals]
              └───────────────┼───────────────┘
                              ▼
                       [Judge Synthesis]
                              │
                      [Guardrail Pass]
                              │
                    [Layer 1 Output]
                              │
                   [Layer 2: Position Sizing]
                              │
                      [Position Card]`}</pre>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-bold">Layer 1 — Judgment</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>Deterministic data pull (no LLM): fundamentals from SEC EDGAR / FMP, macro from FRED, sector-aware indicator selection</li>
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>RAG retrieval with two-stage filter (hard ticker + date filter → semantic rerank) over a markdown corpus of news, analyst, social, and macro files</li>
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>Four parallel persona calls (bull, bear, macro, pure-technicals) + judge synthesis with forced tool-use output</li>
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>Guardrail pass: citation grounding, confidence/persona-agreement consistency, concrete invalidation condition check; up to 2 retries with failure reason appended to judge prompt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Layer 2 — Position Sizing</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>{'Gate: confidence > 0.60 AND magnitude_bucket != "0-3%"'}</li>
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>Fractional Kelly sizing shrunk by 20-day realized volatility</li>
                <li className="flex gap-2"><span className="text-foreground select-none">•</span>Outputs entry price, target, stop loss, hold window, position size (min 2%, max 15%)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What's Built */}
        <section id="whats-built" className="mt-20">
          <h2 className="text-2xl font-bold">What&apos;s Built</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-bold">Component</th>
                  <th className="text-left py-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Data pull node — fundamentals (EDGAR/FMP) + macro (FRED), parallel async", "Built"],
                  ["RAG retrieval node — two-stage filter, cross-encoder rerank, sentiment tagger", "Built"],
                  ["Pydantic schemas — Layer1Output, PositionCard, NumericBlock, etc.", "Built"],
                  ["FastAPI backend — run trigger, SSE streaming, run history, eval routes", "Built"],
                  ["Next.js dashboard — pipeline run form, live node timeline, run list, eval page", "Built"],
                  ["Postgres eval store — schema + migrations", "Built"],
                  ["LangSmith observability — @observe_node decorator, run metadata tagging", "Built"],
                  ["Prometheus metrics — RAG empty block rate, guardrail failure rate, token cost", "Built"],
                  ["Eval harness — calibration curves, feature attribution, regression comparison", "Built"],
                  ["Corpus generator — news/analyst/social/macro pull, LLM tagging pass", "Spec complete"],
                  ["Dataset pipeline — QoQ/YoY entry generation, ground truth labeling", "Spec complete"],
                  ["Persona + judge nodes", "Not built"],
                  ["Guardrail node", "Not built"],
                  ["Layer 2 sizing node", "Not built"],
                  ["Full LangGraph graph wiring", "Not built"],
                  ["Self-improvement loop", "Not built"],
                ].map(([component, status]) => (
                  <tr key={component} className="border-b border-border/50">
                    <td className="py-2 pr-4">{component}</td>
                    <td className="py-2">
                      <span className={
                        status === "Built" ? "text-emerald-600 dark:text-emerald-400 font-medium" :
                        status === "Spec complete" ? "text-amber-600 dark:text-amber-400 font-medium" :
                        "text-muted-foreground"
                      }>{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Repo Layout */}
        <section id="repo-layout" className="mt-20">
          <h2 className="text-2xl font-bold">Repo Layout</h2>
          <div className="mt-6 overflow-x-auto rounded bg-muted/50 p-4">
            <pre className="text-xs leading-relaxed font-mono text-muted-foreground">{`swing-trader/
├── api/
│   ├── main.py                     # FastAPI app
│   └── routes/
│       ├── runs.py                 # POST /runs, GET /runs/{id}/stream (SSE)
│       └── eval_routes.py          # GET /eval/* — calibration, attribution
├── apps/
│   └── dashboard/                  # Next.js 14 observer dashboard
│       ├── app/
│       │   ├── page.tsx            # Run trigger form
│       │   ├── runs/               # Run history + live timeline
│       │   └── eval/page.tsx       # Calibration + eval metrics
│       └── components/
│           └── NodeTimeline.tsx    # Real-time node status viewer
├── src/swing_trader/
│   ├── state.py                    # LangGraph PipelineState
│   ├── schemas/pipeline.py         # All Pydantic data contracts
│   ├── data_pull/
│   │   ├── node.py                 # Fundamentals + macro in parallel
│   │   ├── fundamentals.py         # EDGAR / FMP client
│   │   ├── macro.py                # FRED client
│   │   └── cache.py                # HTTP cache layer
│   ├── rag/
│   │   ├── node.py                 # RAG retrieval node
│   │   └── retriever.py            # Two-stage filter + rerank
│   ├── db/
│   │   ├── pool.py                 # Postgres connection pool
│   │   ├── store.py                # Eval store read/write
│   │   └── ground_truth.py         # Ground truth population
│   ├── eval/harness.py             # Calibration, attribution, regression
│   └── observability/
│       ├── decorators.py           # @observe_node
│       ├── langsmith_config.py     # Project + run metadata
│       └── metrics.py              # Prometheus counters
├── migrations/
│   └── 001_eval_store.sql
├── corpus/                         # RAG corpus (gitignored)
│   ├── news/
│   ├── analyst/
│   ├── social/
│   └── macro/
└── docs/                           # Architecture docs
    ├── PRD.md
    ├── CORPUS_GENERATOR.md
    ├── DATA_PULL_PIPELINE.md
    ├── RAG_PIPELINE.md
    ├── REASONING_PIPELINE.md
    └── ...`}</pre>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" className="mt-20">
          <h2 className="text-2xl font-bold">Quick Start</h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm">1. Python pipeline + API</h3>
              <div className="mt-2 rounded bg-muted/50 p-4">
                <pre className="text-xs font-mono text-muted-foreground">{`pip install -e .
cp .env.example .env
uvicorn api.main:app --reload --port 8000`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm">2. Dashboard</h3>
              <div className="mt-2 rounded bg-muted/50 p-4">
                <pre className="text-xs font-mono text-muted-foreground">{`cd apps/dashboard
npm install
npm run dev          # http://localhost:3000`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm">3. Trigger a run</h3>
              <div className="mt-2 rounded bg-muted/50 p-4">
                <pre className="text-xs font-mono text-muted-foreground">{`curl -X POST http://localhost:8000/runs \\
  -H "Content-Type: application/json" \\
  -d '{"ticker":"AAPL","window_start":"2024-01-01",
       "window_end":"2024-03-31","run_type":"live"}'

# Stream node events
curl -N http://localhost:8000/runs/{run_id}/stream`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-sm">API Reference</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-bold">Method</th>
                    <th className="text-left py-2 font-bold">Path</th>
                    <th className="text-left py-2 font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["POST", "/runs", "Trigger a pipeline run (202)"],
                    ["GET", "/runs/{id}/stream", "SSE stream of node events"],
                    ["GET", "/runs/{id}", "Fetch a completed run"],
                    ["GET", "/runs", "List past runs"],
                    ["GET", "/eval/calibration", "Calibration curve by confidence bucket"],
                    ["GET", "/eval/attribution", "Feature attribution"],
                    ["GET", "/health", "Health check"],
                  ].map(([method, path, desc]) => (
                    <tr key={path} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-mono text-xs">{method}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{path}</td>
                      <td className="py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RAG Corpus */}
        <section id="rag-corpus" className="mt-20">
          <h2 className="text-2xl font-bold">RAG Corpus</h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The corpus is a flat set of markdown files under <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">corpus/</code> with YAML frontmatter containing date, tickers, source type, sentiment labels, and relevance tags. Files are named as <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'corpus/{source_type}/{date}_{ticker}_{slug}.md'}</code>.
          </p>

          <h3 className="mt-6 font-bold">Retrieval Pipeline (4 stages)</h3>
          <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Hard metadata filter</span> — ticker + date range (eliminates most irrelevance before any model runs)</li>
            <li><span className="font-medium text-foreground">Embedding search</span> — top-50 candidates (text-embedding-3-small)</li>
            <li><span className="font-medium text-foreground">Cross-encoder rerank</span> — top-10 by relevance score</li>
            <li><span className="font-medium text-foreground">Sentiment tag pass</span> — labels each chunk bullish/bearish/neutral</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Output capped at 1,500 tokens. If all top-10 chunks score below the reranker threshold, returns an empty block rather than injecting noise.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Retrieval targets:</span> Recall@10 {'>'} 0.80, Precision@10 {'>'} 0.60, MRR {'>'} 0.70
          </p>
        </section>

        {/* Output Schemas */}
        <section id="output-schemas" className="mt-20">
          <h2 className="text-2xl font-bold">Output Schemas</h2>

          <h3 className="mt-6 font-bold text-sm">Layer 1 Output</h3>
          <div className="mt-2 rounded bg-muted/50 p-4">
            <pre className="text-xs font-mono text-muted-foreground">{`{
  "direction": "bullish | bearish | neutral",
  "magnitude_bucket": "0-3% | 3-8% | 8%+",
  "confidence": 0.72,
  "dominant_drivers": ["fundamental", "macro"],
  "invalidation_condition": "Close below $178 or CPI > 3.5%",
  "hold_window_bucket": "weeks",
  "thesis": "..."
}`}</pre>
          </div>

          <h3 className="mt-6 font-bold text-sm">Position Card (Layer 2)</h3>
          <div className="mt-2 rounded bg-muted/50 p-4">
            <pre className="text-xs font-mono text-muted-foreground">{`{
  "gate_passed": true,
  "entry_price": 185.50,
  "target_price": 200.00,
  "stop_loss": "Close below $178 or CPI surprise > 0.4%",
  "hold_window_start": "2024-01-15",
  "hold_window_end": "2024-03-31",
  "position_size_pct": 0.05,
  "kelly_full": 0.18,
  "kelly_fractional": 0.045,
  "volatility_used": 0.28,
  "thesis": "..."
}`}</pre>
          </div>
        </section>

        {/* Eval Harness */}
        <section id="eval-harness" className="mt-20">
          <h2 className="text-2xl font-bold">Eval Harness</h2>
          <div className="mt-6 rounded bg-muted/50 p-4">
            <pre className="text-xs font-mono text-muted-foreground">{`from swing_trader.eval.harness import (
    load_golden_set,
    calibration_curve,
    feature_attribution,
)

records = load_golden_set("datasets/golden_set/entries/")
curve = calibration_curve(records)
print(curve.corrective_actions())
print(feature_attribution(records))`}</pre>
          </div>

          <h3 className="mt-6 font-bold">Five-tier eval hierarchy</h3>
          <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Golden set</span> — minimum 50 curated entries, frozen inputs, manually labeled</li>
            <li><span className="font-medium text-foreground">Regression suite</span> — runs on every prompt/model change; blocks deploy if hit rate drops {'>'} 5pp</li>
            <li><span className="font-medium text-foreground">Adversarial scenarios</span> — conflicting signals, misleading headlines, empty RAG, stale data</li>
            <li><span className="font-medium text-foreground">LLM-as-judge</span> — scores 1-5 per dimension: grounding, attribution, calibration, invalidation, clarity</li>
            <li><span className="font-medium text-foreground">Human spot-check</span> — 10-20 entries per session via eval dashboard</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">Full regression run over 50 golden entries costs ~$5.</p>
        </section>

        {/* Observability */}
        <section id="observability" className="mt-20">
          <h2 className="text-2xl font-bold">Observability</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-foreground select-none">•</span>
              <span><span className="font-medium text-foreground">LangSmith</span> — full trace per pipeline run: every node&apos;s inputs, outputs, token counts, latency. Trace URL stored in eval store.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground select-none">•</span>
              <span><span className="font-medium text-foreground">Prometheus</span> — scraped at :9090/metrics: pipeline runs, node latency, token cost, RAG empty block rate, guardrail failure rate, confidence distribution.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground select-none">•</span>
              <span><span className="font-medium text-foreground">Eval store</span> — Postgres table of every completed run (50+ columns). Ground truth auto-populated after hold windows close. Feeds calibration curves and the self-improvement loop.</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Grafana alert thresholds: {'>'} $0.50/run, guardrail failure rate {'>'} 10%.
          </p>
        </section>

        {/* Model Routing */}
        <section id="model-routing" className="mt-20">
          <h2 className="text-2xl font-bold">Model Routing</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-bold">Stage</th>
                  <th className="text-left py-2 font-bold">Model</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Persona calls (bull, bear, macro, technicals)", "claude-sonnet-4-6"],
                  ["Judge synthesis", "claude-opus-4-6"],
                  ["LLM tagging pass (corpus generator)", "claude-haiku-4-5"],
                  ["Dominant driver labeling (dataset pipeline)", "claude-haiku-4-5"],
                ].map(([stage, model]) => (
                  <tr key={stage} className="border-b border-border/50">
                    <td className="py-2 pr-4">{stage}</td>
                    <td className="py-2 font-mono text-xs">{model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  )
}

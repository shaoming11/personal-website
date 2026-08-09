"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const sections = [
  { id: "intro", label: "Intro" },
  { id: "data-pull", label: "Data Pull" },
  { id: "corpus-generator", label: "Corpus Generator" },
  { id: "rag", label: "RAG" },
  { id: "prompt-composition", label: "Prompt Composition" },
  { id: "persona-reasoning", label: "Persona Reasoning" },
  { id: "judge-synthesis", label: "Judge Synthesis" },
  { id: "guardrails", label: "Guardrails" },
  { id: "eval-loop", label: "Eval Loop" },
  { id: "observability", label: "Observability" },
  { id: "production", label: "Production" },
  { id: "conclusion", label: "Conclusion" },
]

const tools = [
  "Python",
  "FastAPI",
  "Next.js 14",
  "Postgres 16",
  "Docker",
  "Groq (Llama 3.2 3B, 3.1 8B, 3.3 70B)",
  "Jina (embeddings + reranker)",
  "LangGraph",
  "LangSmith",
  "Prometheus + Grafana",
  "Polygon.io",
  "FMP",
  "FRED",
  "GDELT",
  "StockTwits",
  "yfinance",
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
        <p className="mt-2 text-muted-foreground">Building a Swing Trading Agent from Scratch</p>
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
          <p className="mt-1 text-muted-foreground text-sm">~4 Weeks, July 2026</p>

          <h3 className="mt-6 font-bold text-sm">Tech Stack</h3>
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

        {/* Intro */}
        <section id="intro">
          <h2 className="text-2xl font-bold">Intro</h2>

          <h3 className="mt-8 font-bold">Motivation</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            I was previously into trading. I had grown my portfolio by 30% in a span of a couple months doing swing trades — holding positions for days to weeks based on catalysts I&apos;d spot manually.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The problem was that doing this well requires tracking a lot of context simultaneously. Macroscopically, you need to know where interest rates are headed, what employment looks like, what the Fed is signaling. At the news level, you need to know about geopolitical tensions, sector-specific developments, earnings surprises. At the fundamental level, you need P/E ratios, revenue trends, margin trajectories. And at the sentiment level, you need to know what analysts are saying and where retail sentiment is leaning.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            I found it impossible to stay on top of all four dimensions for even a handful of tickers. I&apos;d miss a CPI print that changed the macro picture, or not realize an analyst had downgraded a stock I was watching. The information existed — I just couldn&apos;t process it fast enough.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            My hypothesis was that an LLM agent, given structured access to all four data dimensions via RAG and API pulls, could synthesize these signals better than I could solo. Not because it&apos;s smarter, but because it doesn&apos;t forget to check the Fed funds rate before making a call. I was also reading about production-level agent development — evals, observability, multi-perspective synthesis — and thought this project would be the perfect vehicle to learn those patterns while building something I&apos;d actually use.
          </p>

          <h3 className="mt-8 font-bold">Thesis & Plan</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            My thesis: an agent with LLM-level breadth and access to up-to-date financial data + relevant context via RAG could perform as well or better than a solo retail swing trader, specifically because it considers all factors simultaneously rather than anchoring on whatever signal is loudest that day.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The development approach was to build each pipeline stage in isolation, test it independently, then wire them together end-to-end. The pipeline stages:
          </p>
          <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Data pull</span> — quantitative fundamentals + macro indicators</li>
            <li><span className="font-medium text-foreground">Corpus generator</span> — build the qualitative knowledge base</li>
            <li><span className="font-medium text-foreground">RAG</span> — retrieve relevant context from the corpus</li>
            <li><span className="font-medium text-foreground">Prompt composition</span> — combine quantitative + qualitative into a single prompt</li>
            <li><span className="font-medium text-foreground">Persona reasoning</span> — 4 parallel LLM analysts with different biases</li>
            <li><span className="font-medium text-foreground">Judge synthesis</span> — one LLM weighs all perspectives and outputs a structured recommendation</li>
            <li><span className="font-medium text-foreground">Guardrails</span> — validate the recommendation before acting</li>
            <li><span className="font-medium text-foreground">Eval loop</span> — backtest, measure, and self-improve</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            I structured it this way because each stage has different failure modes and different testing strategies. Data pull is about schema correctness and API reliability. RAG is about retrieval quality. Personas are about prompt engineering. The judge is about structured output parsing. Guardrails are about catching bad recommendations. You can&apos;t debug a bad final output if you don&apos;t know which stage introduced the error.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Data Pull */}
        <section id="data-pull">
          <h2 className="text-2xl font-bold">Data Pull</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Pull quantitative fundamentals (earnings, revenue, valuation) and macroeconomic indicators (rates, CPI, unemployment) to give the persona agents hard numbers to reason over. Without this, the personas would be guessing about whether a stock is overvalued or whether macro conditions are favorable — the numbers ground the analysis.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Two async data sources running in parallel via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">asyncio.gather()</code>:
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Fundamentals</span> (yfinance, free, no API key): pulls EPS actual/estimate/surprise, revenue with YoY comparison, gross margin with prior quarter delta, forward guidance direction (inferred from estimate trends with a 2% threshold), trailing/forward P/E, 52-week range, and corporate actions (keyword-matched from news: buyback, acquisition, merger, dividend, split, CEO changes, etc.). The tricky part was earnings date alignment — reports can drop before or after quarter-end, so I scan within the window plus a 90-day lookback.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Macro</span> (FRED API): the interesting design choice here was sector-aware indicator selection. Tech stocks get 10-Year Treasury, Fed Funds, and CPI. Energy gets WTI crude and natural gas. Real estate gets mortgage rates. Financials get yield curve spread and high-yield OAS. The system maps ticker → sector → relevant FRED series, then pulls start/end values for each indicator within the analysis window. It also detects FOMC meetings in the window via FRED release ID 82 and captures the rate decision.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Both sources are synchronous libraries (yfinance uses requests internally), so they&apos;re wrapped in <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">asyncio.to_thread()</code> to avoid blocking the event loop. This matters because the API server runs on uvicorn — blocking the loop would stall all concurrent requests.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Output</span>: a <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">NumericBlock</code> — pre-rendered markdown containing earnings tables, valuation data, macro indicators with deltas, and FOMC flags. Each quarter gets its own section separated by horizontal rules. The rendering uses format helpers (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_fmt_dollar</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_fmt_billions</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_fmt_pct</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_fmt_x</code>) for consistent number presentation.
          </p>

          <h3 className="mt-8 font-bold">Caching</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Disk-based JSON cache with a two-tier TTL strategy:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Historical data (window_end {'>'} 90 days ago): permanent cache, never expires</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Current quarter: 24-hour TTL</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The cache has two layers: individual API caches (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">cache/fundamentals/</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">cache/macro/</code>) for debugging, and a merged quarter-level cache (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'cache/quarters/{ticker}_{quarter}.json'}</code>) that skips both API calls on hit. This matters for the eval loop where you&apos;re re-running the same tickers across the same windows repeatedly.
          </p>

          <h3 className="mt-8 font-bold">Testing</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This stage was straightforward to test — the main concerns were schema correctness and API reliability. I verified that the output JSON matched the <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">FundamentalsResult</code> and <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">MacroResult</code> Pydantic schemas, that the sector mapping produced the right FRED series for each sector, and that the cache TTL logic correctly distinguished historical from current data. The <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">data_gaps</code> list on each result captures any field that failed to pull, so partial failures don&apos;t crash the pipeline — they just show up as warnings downstream.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Corpus Generator */}
        <section id="corpus-generator">
          <h2 className="text-2xl font-bold">Corpus Generator</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The RAG system needs documents to retrieve from. The corpus generator builds and maintains a library of financial content — news articles, analyst ratings, macro commentary, and social sentiment — organized as markdown files with structured YAML frontmatter. This is the knowledge base that gives the agent awareness of market narrative beyond raw numbers.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Five async data sources pulling into a unified markdown format:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Polygon.io news</span> — ticker-specific articles with cursor-based pagination, up to 200 per ticker/window. Returns title, description, keywords, publisher, URL.</li>
            <li><span className="font-medium text-foreground">GDELT</span> — free, no API key. Geopolitics and macro-adjacent news. Searches by ticker name or company name (e.g., <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'"TSLA" OR "Tesla"'}</code>), 25 results per call.</li>
            <li><span className="font-medium text-foreground">Analyst ratings</span> (yfinance) — upgrades/downgrades with firm names, grade changes, price targets. Also pulls consensus recommendation aggregates (StrongBuy/Buy/Hold/Sell/StrongSell counts).</li>
            <li><span className="font-medium text-foreground">FRED macro corpus</span> — same 6 core series (CPI, Fed Funds, Unemployment, GDP, 10Y Treasury, 10Y Breakeven Inflation) rendered as corpus entries for RAG retrieval.</li>
            <li><span className="font-medium text-foreground">StockTwits</span> — unauthenticated API, only ~30 most recent messages. Skips pulls for windows older than 7 days since the endpoint won&apos;t have historical data. Aggregates sentiment counts (bullish/bearish/neutral) and captures top 5 messages per day.</li>
          </ol>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">File format</span>: each article becomes a markdown file with YAML frontmatter containing date, tickers, source_type, source name, relevance_tags, sentiment_label, sentiment_reason, and URL. Body is the article content with headline as H1. Naming convention: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'{date}_{ticker}_{slug}.md'}</code> where slug is the first 5 words of the headline, slugified.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Corpus layout</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'corpus/{news,analyst,macro,social,_rejected}/'}</code>
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Dedup</span>: URL-based index stored in <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">.url_index.json</code>. For URL-less items (analyst ratings, macro), generates a SHA256 hash of <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">date|ticker|headline</code> as the dedup key. 2,170+ entries indexed.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Quality gate</span>: minimum word count filter per source type (news: 20, analyst: 8, macro: 10, social: 15). Articles below threshold get written to <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_rejected/</code> with a rejection reason in frontmatter. HTML tags are stripped before counting.
          </p>

          <h3 className="mt-8 font-bold">Backfill vs Live Run</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Backfill</span> — historical corpus build. Splits the date range into calendar quarters to manage API rate limits and enable recovery from partial failures. Uses a <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">backfill_manifest.json</code> to track completed ticker/quarter combos, making it safe to re-run after interruptions. Pulls all 5 sources per ticker per quarter via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">asyncio.gather()</code>, with 0.5s inter-ticker delays for API politeness.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Live run</span> — daily job for a single date (defaults to yesterday UTC). Designed for ~06:00 UTC scheduling. Individual source failures are logged but don&apos;t stop the run — missing one day of one source is recoverable.
          </p>

          <h3 className="mt-8 font-bold">LLM Tagging Pass</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            After writing, an LLM batch tagger runs over all untagged files. It sends batches of 20 articles (first 600 chars each) to the 70B judge model, which returns structured JSON with <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">relevance_tags</code> (from a fixed vocabulary: earnings, macro, sentiment, technical, geopolitics, corporate_action, analyst_rating), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">sentiment_label</code>, and <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">sentiment_reason</code>. Tags are validated against the allowed set; unknown tags are dropped. This runs as a post-processing step rather than inline to isolate costs and avoid blocking writes.
          </p>

          <h3 className="mt-8 font-bold">Results</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Backfilled 4 quarters across 8 tickers (AAPL, AMZN, GOOG, MSFT, NVDA, TSLA, SPY, QQQ). Sample write counts: AAPL Q1 2025 pulled 193 articles, NVDA Q1 2025 pulled 154. FRED macro entries are shared across all tickers (6 per quarter). The quality gate rejected short/empty articles into <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_rejected/</code>, keeping the corpus clean for embedding.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* RAG */}
        <section id="rag">
          <h2 className="text-2xl font-bold">RAG</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The RAG system&apos;s job is to surface the right qualitative context — news articles, analyst ratings, macro commentary, social sentiment — for a given ticker and time window. This is what gives the persona agents something to reason over beyond the raw numbers from data pull. Without good retrieval, the personas are just vibing off fundamentals and macros with no awareness of what&apos;s actually happening in the market narrative.
          </p>

          <h3 className="mt-8 font-bold">Architecture</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Two components: an <span className="font-medium text-foreground">indexer</span> and a <span className="font-medium text-foreground">retriever</span>.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Indexer</span> — reads corpus markdown files, chunks them using LangChain&apos;s <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">RecursiveCharacterTextSplitter</code> (400 tokens / 1600 chars, 50 token / 200 char overlap, hierarchical separators: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'\\n\\n → \\n → . →   → ""'}</code>), discards chunks under 100 chars, embeds via Jina, and upserts into a vector store. Each chunk gets a deterministic ID (SHA256 of <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">filepath:chunk_index</code>, truncated to 32 chars) and carries metadata: file_path, chunk_index, date, tickers, source_type, source, relevance_tags, sentiment_label, sentiment_reason, URL, active flag. Skips already-indexed files and anything in <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_rejected/</code>.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Retriever</span> — 4-stage pipeline:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Hard metadata filter</span> — filter by ticker (uppercase normalized), date range (ISO lexicographic for Chroma, native range query for Qdrant), and active=True before any embedding search. This ensures you&apos;re not pulling MSFT articles when analyzing AAPL.</li>
            <li><span className="font-medium text-foreground">Embedding search</span> — constructs query <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{`"{ticker} stock price movement drivers {start} to {end}"`}</code>, appends thesis_hint if provided. Pulls top 200 candidates by cosine similarity. If date-filtered search returns 0 results, retries without date filters to recover context from adjacent periods.</li>
            <li><span className="font-medium text-foreground">Reranker</span> — Jina <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">jina-reranker-v2-base-multilingual</code> via cloud API. Re-scores all 200 candidates, returns top 10 above a 0.2 relevance threshold. Deduplicates by source file (keeps highest-scoring chunk per article). On API failure, falls back to raw embedding similarity scores so the pipeline doesn&apos;t die.</li>
            <li><span className="font-medium text-foreground">Sentiment tag pass</span> — chunks missing sentiment labels get tagged on the fly by the 3B model (bullish/bearish/neutral + one sentence reason). Most chunks already have sentiment from the corpus tagger, but this catches gaps. On LLM failure, marks all untagged as neutral — doesn&apos;t block the pipeline.</li>
          </ol>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Token budget</span>: 1500 tokens for the final <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">QualitativeBlock</code>, with priority ordering: analyst {'>'} news {'>'} macro {'>'} social. Items are greedily added in priority order until the budget is exhausted. Analyst ratings get priority because they tend to be the most information-dense and actionable for swing trade decisions.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Vector store abstraction</span>: Chroma for dev (local PersistentClient, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">.chroma</code> directory), Qdrant for prod (URL-based client). Both use cosine distance. Controlled by <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">VECTOR_STORE</code> env var. The abstraction exposes <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">upsert</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">search</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">file_is_indexed</code>, and <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">delete_by_file_path</code> — everything else is backend-specific.
          </p>

          <h3 className="mt-8 font-bold">Testing & Eval</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            RAG quality depends on architecture parameters (chunk size, embedding model, reranker, threshold) that all interact. So I built a formal eval script (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">tests/eval_rag.py</code>) to measure retrieval quality across multiple dimensions.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Golden-set test cases</span> — 9 cases covering:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Positive retrieval: NVDA March 2025 ({'≥'} 3 chunks), AAPL Feb-Mar 2025 ({'≥'} 2), MSFT Q1 2025 ({'≥'} 2)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Thesis hint impact: NVDA with &quot;AI chip demand and data center spending&quot; hint ({'≥'} 3)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Negative cases: fake ticker XYZFAKE (expect empty), valid ticker with out-of-range dates (expect empty)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Source type validation: TSLA should include analyst source types</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Narrow windows: AAPL in just June 2025</li>
          </ul>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Rerank lift measurement</span> — compared embedding-only ranking vs Jina reranker on NVDA March 2025:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Top-10 overlap (how many docs appear in both)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Mean rank displacement (how much positions shift)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Threshold filter rate (how many docs drop below 0.2)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span>Raw score distributions for both methods</li>
          </ul>

          <h3 className="mt-8 font-bold">Key Finding: SPY/ETF Problem</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            SPY/ETF queries scored poorly with the original ms-marco cross-encoder. Corpus articles discuss &quot;market selloff&quot; or &quot;S&P 500 drops&quot; but the cross-encoder was looking for &quot;SPY stock price movement&quot; literally. It couldn&apos;t bridge that semantic gap. This was one of the motivations for switching to the Jina reranker.
          </p>

          <h3 className="mt-8 font-bold">How Things Changed After Testing</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Ollama → Groq/Jina cloud</span> — managing local Ollama models was annoying (pulling models, disk space, keeping them running). Cloud providers with free tiers gave equivalent quality with zero ops. The swap was a single-file change in <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">clients.py</code> because all provider logic is centralized there.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Local cross-encoder → Jina reranker API</span> — moved from sentence-transformers <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">ms-marco-MiniLM-L-6-v2</code> (in-process, synchronous) to Jina&apos;s <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">jina-reranker-v2-base-multilingual</code> (cloud, async). Side benefit: made <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">_rerank()</code> async, improving pipeline parallelism. Added a fallback to raw embedding scores on API failure.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">top_k_before_rerank 50 → 200</span> — after seeing the rerank lift results, the reranker was good enough to handle a much larger candidate set. Wider net in embedding search + reranker doing the heavy lifting on relevance gave better final results.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Embedding model swap</span> — nomic-embed-text (Ollama) to jina-embeddings-v2-base-en (Jina cloud). Both 768-dim, so no vector store rebuild needed. Intentional dimensionality match.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Reranker threshold 0.3 → 0.2</span> — loosened after testing showed 0.3 was too aggressive for some queries, particularly those with thesis hints that steered retrieval toward niche topics.</span></li>
          </ul>
        </section>

        <hr className="my-16 border-border" />

        {/* Prompt Composition */}
        <section id="prompt-composition">
          <h2 className="text-2xl font-bold">Prompt Composition</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Combine the quantitative data (NumericBlock from data pull) and qualitative context (QualitativeBlock from RAG) into a single prompt that gets sent to all four persona agents. This is the bridge between data gathering and reasoning.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">build_composed_prompt()</code> in <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">prompts.py</code> — straightforward assembly:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">NumericBlock</span> — the pre-rendered markdown text (earnings tables, valuation, macro indicators with deltas, FOMC flags). Falls back to <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'"[No numeric data available.]"'}</code> if the data pull failed entirely.</li>
            <li><span className="font-medium text-foreground">QualitativeBlock</span> — renders itself via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">.render()</code> into grouped bullets sorted by source type priority (analyst {'>'} news {'>'} macro {'>'} social). Each item shows: date, source, sentiment label, sentiment reason, and a quoted summary (max 800 chars). Falls back to <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'"[No qualitative context available.]"'}</code>.</li>
            <li><span className="font-medium text-foreground">Thesis hint</span> (optional) — appended as a <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">=== USER THESIS HINT ===</code> section if the user provided one.</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The composed prompt then gets wrapped in a user message template: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{`"Analyze the following data for a swing trade assessment:\\n\\n{composed_prompt}"`}</code> — and this identical message is sent to all four personas. Only the system prompt differs.
          </p>

          <h3 className="mt-8 font-bold">Design Choice</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The key decision here was separation of data from reasoning. The data blocks are built upstream by dedicated nodes; <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">prompts.py</code> only composes text. This means you can swap data sources, change the RAG retriever, or modify the rendering format without touching the reasoning layer. It also means the same composed prompt goes to all four personas verbatim — they see the exact same evidence and disagree only because of their system prompt bias.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Persona Reasoning */}
        <section id="persona-reasoning">
          <h2 className="text-2xl font-bold">Persona Reasoning</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Instead of asking one LLM for a trading recommendation and getting a wishy-washy &quot;it depends&quot; answer, run four parallel analysts with deliberately opposing biases. This forces the system to articulate both the bull case and the bear case with specific evidence, rather than hedging.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Four personas, each with a focused system prompt:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Bull analyst</span> — &quot;find the strongest case FOR buying this stock.&quot; Emphasizes upside catalysts, positive earnings surprises, improving fundamentals, favorable sentiment. Must cite specific numbers.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Bear analyst</span> — &quot;find the strongest case AGAINST buying.&quot; Emphasizes downside risks, deteriorating fundamentals, overvaluation, negative sentiment. Must cite specific numbers.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Macro strategist</span> — &quot;evaluate purely through the macro lens: interest rates, inflation, GDP, sector rotation, Fed policy.&quot; Determines whether macro tailwinds or headwinds dominate.</span></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span><span className="font-medium text-foreground">Technical analyst</span> — &quot;assess whether overbought or oversold based on valuation multiples, price levels relative to 52-week range, and momentum signals.&quot; States a directional lean with reasoning.</span></li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            All four constrained to 3-5 sentences and 300 max tokens. They run simultaneously via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">asyncio.gather()</code> on the Groq <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">llama-3.1-8b-instant</code> (8B model) at <span className="font-medium text-foreground">temperature 0.7</span> — high enough for diverse, creative analysis from each perspective but not so high that they hallucinate data.
          </p>

          <h3 className="mt-8 font-bold">Testing</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This was mostly prompt iteration. I&apos;d run the pipeline on a ticker where I knew the right answer (e.g., NVDA in Q1 2025 during the AI boom), read all four persona outputs, and check whether they were citing the actual data from the composed prompt or making things up. The main failure mode was personas ignoring the numeric data and just generating generic financial commentary. Tightening the system prompts to say &quot;cite specific numbers from the data provided&quot; fixed most of this.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">PersonaOutputs</code> Pydantic model tracks all four outputs and exposes an <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">agreement_ratio(direction)</code> method that uses keyword matching (bullish/upside/long vs bearish/downside/short) to measure how many personas align with a given direction. This feeds into the guardrail checks.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Judge Synthesis */}
        <section id="judge-synthesis">
          <h2 className="text-2xl font-bold">Judge Synthesis</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Take the four persona perspectives plus the original data context and synthesize a single, structured trade recommendation. The judge resolves disagreements between personas by weighing evidence quality, not just counting votes.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Single LLM call on Groq <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">llama-3.3-70b-versatile</code> (70B model) at <span className="font-medium text-foreground">temperature 0.3</span> — low for deterministic, stable synthesis and reliable JSON output.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The judge receives a concatenated prompt:
          </p>
          <div className="mt-3 rounded bg-muted/50 p-4">
            <pre className="text-xs font-mono text-muted-foreground">{`=== DATA CONTEXT ===         <- original composed prompt
=== BULL ANALYST ===          <- persona output
=== BEAR ANALYST ===          <- persona output
=== MACRO STRATEGIST ===      <- persona output
=== TECHNICAL ANALYST ===     <- persona output
=== USER THESIS HINT ===      <- optional`}</pre>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The system prompt instructs it to return <span className="font-medium text-foreground">only</span> a valid JSON object with these fields:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">direction</code>: bullish | bearish | neutral</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">magnitude_bucket</code>: 0-3% | 3-8% | 8%+</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">confidence</code>: float 0.0-1.0 (must reflect genuine uncertainty, not default to 0.5)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">dominant_drivers</code>: list of fundamental | macro | sentiment | technical (no duplicates, at least 1)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">invalidation_condition</code>: min 20 chars, must reference a specific price level, percentage, or named event</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">hold_window_bucket</code>: days | weeks | quarter</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">thesis</code>: min 30 chars, synthesized investment thesis</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">sided_with</code>: which personas the judge agreed with most</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">sided_reasoning</code>: 1-2 sentences on why those perspectives were weighted more</li>
          </ul>

          <h3 className="mt-8 font-bold">Temperature Gradient</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            This is a deliberate design pattern across the pipeline:
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-bold">Stage</th>
                  <th className="text-left py-2 font-bold">Model</th>
                  <th className="text-left py-2 font-bold">Temp</th>
                  <th className="text-left py-2 font-bold">Rationale</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4">Personas</td>
                  <td className="py-2 pr-4 font-mono text-xs">8B</td>
                  <td className="py-2 pr-4">0.7</td>
                  <td className="py-2">Diverse, exploratory analysis</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4">Judge</td>
                  <td className="py-2 pr-4 font-mono text-xs">70B</td>
                  <td className="py-2 pr-4">0.3</td>
                  <td className="py-2">Deterministic convergence, reliable JSON</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The idea is that you want creativity at the opinion stage and precision at the synthesis stage. The personas are encouraged to find interesting angles; the judge is encouraged to be consistent and parseable.
          </p>

          <h3 className="mt-8 font-bold">Structured Output Parsing</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            JSON extraction is defensive: find the first <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'{'}</code> and last <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'}'}</code> in the response, parse that substring. This handles cases where the LLM adds commentary before or after the JSON block. The parsed dict is validated against the <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">Layer1Output</code> Pydantic model, which enforces:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">invalidation_condition</code> must not contain vague phrases (&quot;if things go wrong&quot;, &quot;uncertainty&quot;, &quot;market conditions&quot;) and must contain concrete references ($, %, or named events like CPI/GDP/FOMC/Fed)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">dominant_drivers</code> must not contain duplicates</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">confidence</code> must be in [0.0, 1.0]</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">thesis</code> must be at least 30 characters</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Validation failures are caught and fed into the guardrail retry loop.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Guardrails */}
        <section id="guardrails">
          <h2 className="text-2xl font-bold">Guardrails</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Catch bad recommendations before they reach position sizing. The judge can produce structurally valid JSON that&apos;s still a bad recommendation — high confidence with no persona agreement, vague invalidation conditions, or neutral direction with high confidence (contradictory). Guardrails are the last line of defense.
          </p>

          <h3 className="mt-8 font-bold">Solution</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Five checks, run sequentially after judge output:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Confidence floor</span> — confidence must be {'>='} 0.40 (configurable via env var). Below this, the signal is too weak to act on.</li>
            <li><span className="font-medium text-foreground">Invalidation quality</span> — regex match against concrete financial references: $ amounts, percentages, named indicators (CPI, GDP, FOMC, earnings), technical levels (support, resistance, MA, RSI, MACD). Must also be {'>='} 20 characters. Catches vague invalidations like &quot;if the market goes down.&quot;</li>
            <li><span className="font-medium text-foreground">Data gaps threshold</span> — if more than 4 data fields failed to pull (configurable), the recommendation is based on incomplete information. Forces lower confidence or explicit uncertainty acknowledgment.</li>
            <li><span className="font-medium text-foreground">Persona agreement</span> — if confidence {'>='} 0.70 and direction is not neutral, at least 25% of personas must agree with the direction (via keyword matching). Catches cases where the judge is highly confident but none of the personas actually supported that direction.</li>
            <li><span className="font-medium text-foreground">Neutral high confidence contradiction</span> — neutral direction with confidence {'>'} 0.80 is inherently contradictory. High confidence implies you know something; neutral implies you don&apos;t.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Retry mechanism</span>: on failure, the judge is re-invoked with the failure reasons injected into the prompt. Max 2 retries (configurable). If all retries exhaust, the pipeline is cancelled with a reason string stored in the database.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Eval Loop */}
        <section id="eval-loop">
          <h2 className="text-2xl font-bold">Eval Loop & Self-Improvement</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The pipeline produces recommendations, but are they any good? The eval loop backtests against historical data, measures prediction quality across multiple dimensions, and uses an LLM to patch the persona/judge prompts based on where the system is failing.
          </p>

          <h3 className="mt-8 font-bold">Benchmarks</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Six metrics with pass/fail thresholds:
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-bold">Metric</th>
                  <th className="text-left py-2 font-bold">Threshold</th>
                  <th className="text-left py-2 font-bold">What it measures</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["direction_accuracy", "≥ 55%", "Did we get bullish/bearish/neutral right?"],
                  ["magnitude_accuracy", "≥ 35%", "Did we get the move size bucket right?"],
                  ["calibration_error", "≤ 15pp", "Gap between stated confidence and actual hit rate"],
                  ["high_confidence_precision", "≥ 65%", "Hit rate when confidence ≥ 0.70"],
                  ["cancellation_rate", "≤ 20%", "Fraction of runs killed by guardrails"],
                  ["mean_price_target_error", "≤ 12pp", "Average error between predicted and actual move"],
                ].map(([metric, threshold, desc]) => (
                  <tr key={metric} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs">{metric}</td>
                    <td className="py-2 pr-4">{threshold}</td>
                    <td className="py-2">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 font-bold">Ground Truth Population</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            A daily job that runs after hold windows close:
          </p>
          <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li>Queries pending runs where <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">ground_truth_populated = FALSE</code> and <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'hold_window_end <= today'}</code></li>
            <li>Fetches actual entry/exit prices via Polygon.io (with +/- 5 day buffer for weekends/holidays)</li>
            <li>Computes actual direction ({'>'} 1% = bullish, {'<'} -1% = bearish, else neutral), actual magnitude, and price error</li>
            <li>Scores each prediction as hit (direction + magnitude match) or miss</li>
            <li>Upserts results to Postgres</li>
          </ol>

          <h3 className="mt-8 font-bold">Self-Improvement Loop</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The core iteration cycle, run per quarter:
          </p>
          <ol className="mt-3 space-y-1.5 text-sm text-muted-foreground list-decimal list-inside">
            <li>Run pipeline on all tickers in the watchlist (30s delay between tickers for rate limits)</li>
            <li>Fetch ground truth</li>
            <li>Compute all 6 benchmark metrics</li>
            <li>If all pass → advance to next quarter</li>
            <li>If any fail → generate a failure report showing which metrics failed, which drivers had highest miss rates, which tickers were worst</li>
            <li>Send the failure report to the 70B judge model, which returns JSON patches — 1-2 sentence additions to each persona/judge system prompt</li>
            <li>Apply patches to in-memory prompts (appended, never full rewrites)</li>
            <li>Save prompt snapshots and reports to <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{'eval_runs/{quarter}/'}</code></li>
            <li>Repeat (max 5 iterations per quarter)</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            If on a non-first quarter, iteration 1 checks for &quot;big gap&quot; — if the worst metric gap exceeds 0.20 compared to the prior quarter&apos;s final performance, it alerts the user that prompt patches may not be generalizing.
          </p>

          <h3 className="mt-8 font-bold">Results</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Ran the loop across three quarters:
          </p>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">2025-Q3</span> (2/5 tickers scored): direction 50% (FAIL), magnitude 50% (PASS), calibration 0.0 (PASS), high-conf precision 50% (FAIL), cancellation 60% (FAIL), price error 5.76pp (PASS). Worst ticker: AMZN predicted bullish, actual neutral. Driver miss rates: fundamental 50%, sentiment 50%, macro 0%.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">2025-Q4</span> (3/5 scored, 5 prompt iterations): direction 0% (FAIL — worsened), magnitude 33.3% (FAIL), calibration 0.7pp (FAIL), high-conf precision 0% (FAIL), cancellation 40% (FAIL), price error 7.29pp (PASS). All drivers at 100% miss rate. Prompt files grew from 6.15KB to 10.38KB over 5 iterations of cumulative patches.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">2026-Q1</span> (1/5 scored, stopped at iteration 2): direction 0% (FAIL), magnitude 100% (PASS), calibration 0.0 (PASS), high-conf precision 0% (FAIL), cancellation 80% (FAIL — critical), price error 11.98pp (PASS). Worst ticker: NVDA predicted bullish, actual bearish.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The results show a clear pattern: the system is overconfident and directionally biased toward bullish. Cancellation rates spiked from 40% to 80%, suggesting the guardrails are catching more bad recommendations as prompts accumulate patches — the patches aren&apos;t fixing the underlying issue, they&apos;re adding noise. Prompt file sizes growing with each iteration confirms this: cumulative patching without pruning degrades quality.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Observability */}
        <section id="observability">
          <h2 className="text-2xl font-bold">Observability</h2>

          <h3 className="mt-8 font-bold">Purpose</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            When the pipeline produces a bad recommendation, you need to know which stage failed and why. Observability is instrumented at three levels: per-node timing (Prometheus), full trace capture (LangSmith), and structured run storage (Postgres).
          </p>

          <h3 className="mt-8 font-bold">Prometheus Metrics</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Exposed on port 9090 via <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">start_metrics_server()</code>:
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">Pipeline level</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">pipeline_runs_total</code> (by ticker, run_type, outcome), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">pipeline_duration_seconds</code> (buckets: 5s to 5min)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">Node level</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">node_duration_seconds</code> (by node_name, buckets: 0.5s to 30s)</li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">LLM cost</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">llm_tokens_total</code> (by node, model, input/output), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">llm_cost_usd_total</code></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">RAG</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">rag_chunks_retrieved</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">rag_chunks_used</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">rag_empty_block_total</code></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">Guardrails</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">guardrail_checks_total</code> (by check_name, pass/fail), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">guardrail_retries_total</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">pipeline_cancellations_total</code></li>
            <li className="flex gap-2"><span className="text-foreground select-none">•</span><span className="font-medium text-foreground">Layer 1</span>: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">layer1_confidence</code> histogram (10 buckets), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">layer1_direction_total</code></li>
          </ul>

          <h3 className="mt-8 font-bold">LangSmith Integration</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every pipeline run gets a LangSmith trace with metadata: ticker, window, user_id, run_type, pipeline_version. Each node enriches its span with structured metadata (e.g., the judge node logs direction, confidence, magnitude, sided_with, agreement_ratio). Trace URLs are captured and stored in the <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">langsmith_trace_url</code> column in Postgres for post-hoc debugging.
          </p>

          <h3 className="mt-8 font-bold">@observe_node Decorator</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Wraps both sync and async LangGraph node functions. Records <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">NODE_DURATION_SECONDS</code> histogram, optionally layers LangSmith <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">@traceable</code> on top if tracing is enabled. Uses <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">time.perf_counter()</code> for nanosecond precision. Always records metrics even on failure (finally block).
          </p>

          <h3 className="mt-8 font-bold">Postgres Eval Store</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            45+ column <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">pipeline_runs</code> table storing everything: identity (run_id, ticker, window), layer 1 output (all fields from Layer1Output), layer 2 output (gate decision, entry/target/stop prices, position sizing, Kelly criterion), ground truth (actual direction, magnitude, hit, price error, timing), debug inputs (numeric_block_text, data_gaps, RAG chunks, top chunks as JSONB), debug reasoning (all four persona outputs, judge reasoning), debug guardrails (checks as JSONB, retry count, cancellation reason), and trace URL.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Three materialized views: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">calibration_curve</code> (confidence bucket → hit rate), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">feature_attribution</code> (per-driver miss rate), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">pipeline_regression</code> (per-version hit rate, avg confidence, cancellation rate).
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Production Hardening */}
        <section id="production">
          <h2 className="text-2xl font-bold">Production Hardening</h2>

          <h3 className="mt-8 font-bold">API Server</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            FastAPI on uvicorn with 2 workers. Startup validates required env vars (fail-fast). Health check endpoint pings both database and vector store. Three route groups: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">/runs</code> (trigger, SSE stream, history), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">/eval</code> (calibration, attribution, regression, self-improvement), <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">/corpus</code> (backfill, indexing, status).
          </p>

          <h3 className="mt-8 font-bold">Auth & Rate Limiting</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            API key auth via custom middleware — <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">API_KEYS</code> env var (comma-separated), validated with <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">secrets.compare_digest()</code> to prevent timing attacks. Per-IP sliding window rate limiter (30 req/min default, 10 burst). Public paths (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">/health</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">/docs</code>) bypass both.
          </p>

          <h3 className="mt-8 font-bold">Docker</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Multi-stage build: builder stage installs deps with gcc, runtime stage copies only site-packages. Non-root <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">appuser</code>, port 8000, built-in health check. Docker-compose bundles API + Postgres 16 + Prometheus + Grafana with provisioned dashboards.
          </p>

          <h3 className="mt-8 font-bold">CI/CD</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            GitHub Actions on push to main and all PRs: lint (ruff, pinned to match local), test (pytest with Postgres service container), security (pip-audit), docker build (only after lint + test pass). Recent fixes: pinned ruff version after CI/local drift, fixed pip-audit to install non-editable so it can audit dependencies.
          </p>

          <h3 className="mt-8 font-bold">Dashboard</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Next.js 14 + React 18 + TypeScript + Tailwind. Pipeline trigger form with client-side window validation (mirrors backend constraints: 90-365 day window, 45-day recency minimum). Run history table with color-coded direction/confidence. Live run detail page with SSE streaming of node execution timeline. Eval page with calibration curve, feature attribution, and regression comparison visualizations. API requests proxied via Next.js rewrites to the backend.
          </p>

          <h3 className="mt-8 font-bold">Batch Runner</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">watchlist.yaml</code> defines tickers and defaults (window_days, run_type, delay_seconds). Processes tickers sequentially with configurable inter-ticker delay (default 30s). Logs per-ticker results (direction, confidence, duration) and prints a summary table.
          </p>
        </section>

        <hr className="my-16 border-border" />

        {/* Conclusion */}
        <section id="conclusion">
          <h2 className="text-2xl font-bold">Conclusion</h2>

          <h3 className="mt-8 font-bold">Evaluation of Results</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The system works end-to-end: data pull → corpus → RAG → prompt → personas → judge → guardrails, with full observability at every stage. The architecture is sound — centralized client management, async throughout, Pydantic contracts between every stage, disk caching for eval loops, and a clean separation between data gathering and reasoning.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            But the eval results are honest: direction accuracy didn&apos;t beat 55% across any quarter tested. The system is overconfident and bullish-biased. The self-improvement loop&apos;s cumulative patching strategy degraded rather than improved — prompts grew from 6KB to 10KB without meaningfully changing the failure patterns. Cancellation rates spiking to 80% means the guardrails are doing their job (catching bad recommendations), but also means the upstream reasoning is producing more bad recommendations as patches accumulate.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The most valuable components turned out to be the ones I expected least: the guardrails caught genuinely dangerous recommendations (high confidence + no persona agreement), the RAG eval revealed the SPY/ETF semantic gap problem, and the observability stack made it possible to trace exactly which stage introduced each error.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The least valuable: the self-improvement loop in its current form. Appending sentences to prompts is a blunt instrument — it lacks the ability to identify and fix specific failure modes. A better approach would be few-shot examples of correct reasoning on the failure cases, or fine-tuning the judge on the eval store data.
          </p>

          <h3 className="mt-8 font-bold">What&apos;s Next</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The pipeline infrastructure is production-ready, but the reasoning quality needs iteration:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><span className="font-medium text-foreground">Replace cumulative patching with few-shot examples</span> — instead of appending vague instructions, show the judge examples of correct reasoning on its past failures</li>
            <li><span className="font-medium text-foreground">Fine-tune the judge on eval store data</span> — 45+ columns of structured prediction → outcome data is exactly what you need for supervised fine-tuning</li>
            <li><span className="font-medium text-foreground">Add a momentum/trend model</span> — the technical persona is operating on valuation multiples and 52-week range, but has no access to actual price charts, moving averages, or RSI. A lightweight technical indicator layer would fill this gap</li>
            <li><span className="font-medium text-foreground">Expand the corpus to include earnings call transcripts</span> — the highest-signal qualitative data for fundamentals-driven trades</li>
            <li><span className="font-medium text-foreground">Explore commercial viability</span> — small-cap coverage is sparse and expensive; automated analysis could be valuable for tickers that institutional research doesn&apos;t cover. But the moat question is real: the pipeline is replicable, and the alpha (if any) comes from corpus quality and prompt tuning, both of which are ephemeral advantages</li>
          </ol>
        </section>
      </article>
    </div>
  )
}

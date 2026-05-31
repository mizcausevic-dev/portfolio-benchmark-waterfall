# Architecture

Portfolio Benchmark Waterfall is a static-friendly TypeScript executive-intelligence layer for peer-relative exposure, savings, urgency, and investment sequencing.

## Core flow

- `src/data/sampleVerticalBrief.ts` models benchmark tracks across AI, identity, revenue, FinTech, biotech, procurement, and public-sector readiness.
- `src/analyze.ts` scores exposure, savings potential, investment priority, confidence, and urgency while generating benchmark findings.
- `src/services/verticalBriefService.ts` exposes the benchmark-lane, peer-gap, investment-waterfall, and risk-map packets used by both the app and prerender step.
- `src/services/render.ts` turns those packets into board-readable HTML routes plus a sample export.
- `scripts/prerender.ts` produces the static site and JSON payloads for GitHub Pages.

## Output shape

Each track is designed to answer the same executive questions:

- where are we exposed relative to peers
- where can we save money
- where should we invest next
- what benchmark story do we tell the board or investors

## Guardrails

- synthetic data only
- read-only public surface
- no tenant credentials or private documents
- no compliance overclaim language

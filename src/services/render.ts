import { toExport } from "../analyze.js";
import { samplePortfolioBenchmarkWaterfall } from "../data/sampleVerticalBrief.js";
import { benchmarkLane, investmentWaterfall, payload, peerGaps, riskMap, summary, verification } from "./verticalBriefService.js";

const productTitle = "Portfolio Benchmark Waterfall";
const domain = "https://benchmark.kineticgain.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function shell(title: string, active: string, body: string, description: string) {
  const routes = [
    ["/", "Overview"],
    ["/benchmark-lane", "Benchmark lane"],
    ["/peer-gaps", "Peer gaps"],
    ["/investment-waterfall", "Investment waterfall"],
    ["/verification", "Verification"],
    ["/docs", "Docs"]
  ];

  const nav = routes
    .map(([href, label]) => {
      const current = href === active ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${productTitle} · ${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${domain}${active === "/" ? "/" : `${active}/`}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${productTitle} · ${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${domain}${active === "/" ? "/" : `${active}/`}" />
    <meta name="twitter:card" content="summary_large_image" />
    <style>
      :root{
        --onyx:#0A0B11;--cream:#F5F2EB;--bluegray:#475B6B;--bluegray-bright:#6E879A;
        --radius:16px;--maxw:1180px;--ease:cubic-bezier(.22,.61,.36,1);
        --font:"Geist",-apple-system,sans-serif;--mono:"Geist Mono",ui-monospace,monospace;--serif:"Newsreader",Georgia,serif;
        --a-emerald:#34D399;--a-cyan:#22D3EE;--a-violet:#A78BFA;--a-amber:#FBBF24;--a-pink:#F472B6;
      }
      html[data-theme="dark"]{--ground:#0A0B11;--ink:var(--cream);--ink-dim:#9AA1AD;--ink-faint:#565C68;--surface:rgba(255,255,255,.025);--surface-2:rgba(255,255,255,.045);--line:rgba(255,255,255,.08);--line-soft:rgba(255,255,255,.05);--signal:var(--bluegray-bright)}
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:var(--ground);color:var(--ink);font-family:var(--font);line-height:1.5;letter-spacing:-.011em;-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative}
      body::after{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(900px 600px at 12% -5%,rgba(124,92,232,.16),transparent 60%),radial-gradient(800px 600px at 92% 8%,rgba(34,211,238,.10),transparent 55%),radial-gradient(1000px 700px at 70% 100%,rgba(71,91,107,.18),transparent 60%),linear-gradient(180deg,#0A0B11 0%,#0C0E16 55%,#0A0C13 100%)}
      a{color:inherit}
      .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px}
      .eyebrow{font-family:var(--mono);font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-faint)}
      .hero{padding:72px 0 48px;position:relative;z-index:2}
      .hero-shell,.section,.table-wrap,footer{background:var(--surface);border:1px solid var(--line);border-radius:24px;box-shadow:0 24px 80px rgba(0,0,0,.18)}
      .hero-shell{padding:28px}
      .topbar{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:18px}
      .product{font:600 28px/1.1 var(--font);letter-spacing:-.035em}
      nav{display:flex;flex-wrap:wrap;gap:10px}
      nav a{padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink-dim);font-family:var(--mono);font-size:12px;letter-spacing:.05em;text-transform:uppercase;text-decoration:none}
      nav a[aria-current="page"]{border-color:rgba(34,211,238,.45);background:color-mix(in srgb,var(--a-cyan) 10%,transparent);color:var(--ink)}
      h1,h2,h3{margin:18px 0 10px;line-height:1.04;letter-spacing:-.035em}
      h1{font-size:clamp(40px,6.4vw,72px);font-weight:600;max-width:14ch;font-family:var(--serif);font-style:italic}
      h2{font-size:clamp(28px,3.6vw,44px);font-family:var(--serif);font-style:italic;font-weight:600}
      h3{font-size:20px;font-weight:600}
      .lede,.section p,td,th,li,.metric-copy{color:var(--ink-dim);line-height:1.6}
      .lede{margin-top:22px;font-size:17px;max-width:62ch}
      .metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-top:26px}
      .metric{padding:22px;background:var(--surface-2);border:1px solid var(--line);border-radius:20px;position:relative;overflow:hidden}
      .metric::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--a-violet),var(--a-cyan))}
      .metric-label{color:var(--ink-faint);font:500 11px/1.2 var(--mono);letter-spacing:.14em;text-transform:uppercase}
      .metric-value{display:block;margin-top:12px;font:600 38px/1 var(--serif);letter-spacing:-.04em;color:var(--ink)}
      .section,.table-wrap{margin-top:28px;padding:24px;position:relative;z-index:2}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:18px}
      .card{padding:18px;border-radius:20px;border:1px solid var(--line);background:var(--surface-2);position:relative;overflow:hidden}
      .card::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--a-emerald),var(--a-cyan));opacity:.9}
      .pill{display:inline-flex;align-items:center;padding:7px 11px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink-dim);font:500 11px/1.1 var(--mono);letter-spacing:.06em;text-transform:uppercase}
      .pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
      .table-wrap table{width:100%;border-collapse:collapse;margin-top:14px}
      th,td{text-align:left;vertical-align:top;padding:14px 12px;border-top:1px solid var(--line-soft)}
      th{color:var(--ink);font:500 11px/1.2 var(--mono);letter-spacing:.14em;text-transform:uppercase}
      footer{margin-top:28px;padding:18px 20px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;color:var(--ink-dim);font-size:14px}
      .footer-links{display:flex;flex-wrap:wrap;gap:16px}
      .footer-links a{font-family:var(--mono);font-size:12px;letter-spacing:.05em;text-transform:uppercase;text-decoration:none}
      code{padding:2px 6px;border-radius:6px;background:rgba(255,255,255,.05)}
      ul{padding-left:20px}
      @media (max-width:720px){.topbar{flex-direction:column;align-items:flex-start}.wrap{padding:0 14px}.hero{padding:36px 0 24px}.hero-shell,.section,.table-wrap,footer{padding:18px;border-radius:20px}}
    </style>
  </head>
  <body>
    <div class="wrap">
      <section class="hero">
        <div class="hero-shell">
          <div class="topbar">
            <div class="product">${productTitle}</div>
            <nav>${nav}</nav>
          </div>
          <span class="eyebrow">Executive intelligence · portfolio benchmark layer</span>
          ${body}
          <footer>
            <div>Peer-relative exposure, savings, investment priority, and benchmark-safe narratives for boards, operators, and diligence teams.</div>
            <div class="footer-links">
              <a href="https://github.com/mizcausevic-dev/">GitHub</a>
              <a href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
              <a href="https://kineticgain.com/">Kinetic Gain</a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  </body>
</html>`;
}

export function renderOverview() {
  const executiveSummary = summary();
  const lanes = benchmarkLane();
  const risks = riskMap().slice(0, 5);
  const cards = lanes
    .slice(0, 6)
    .map(
      (item) => `<article class="card">
        <span class="pill">${escapeHtml(item.benchmarkStatus)}</span>
        <h3>${escapeHtml(item.audience)}</h3>
        <p>${escapeHtml(item.boardQuestion)}</p>
        <div class="pills">
          <span class="pill">${escapeHtml(item.owner)}</span>
          <span class="pill">${escapeHtml(item.benchmarkTheme)}</span>
        </div>
      </article>`
    )
    .join("");
  const riskRows = risks
    .map((item) => `<tr><td>${escapeHtml(item.audience)}</td><td>${escapeHtml(item.code)}</td><td>${escapeHtml(item.severity)}</td><td>${escapeHtml(item.message)}</td></tr>`)
    .join("");

  return shell(
    "Overview",
    "/",
    `
      <h1>Benchmark exposure, savings, and investment against the peers that matter.</h1>
      <p class="lede">Portfolio Benchmark Waterfall turns AI, identity, revenue, FinTech, biotech, procurement, and public-sector lanes into one benchmark layer so leaders can see where they lead, where they lag, where dollars sit at risk, and what investment story belongs in the board packet.</p>
      <div class="metrics">
        <div class="metric"><span class="metric-label">Benchmark lanes</span><span class="metric-value">${executiveSummary.items}</span><div class="metric-copy">Modeled executive benchmark tracks in the current estate.</div></div>
        <div class="metric"><span class="metric-label">Average exposure</span><span class="metric-value">${executiveSummary.averageExposureScore}</span><div class="metric-copy">Where unresolved operational or diligence pressure still sits relative to peers.</div></div>
        <div class="metric"><span class="metric-label">Savings potential</span><span class="metric-value">${executiveSummary.averageSavingsPotential}</span><div class="metric-copy">How strongly each lane can argue for efficiency, cycle-time recovery, or margin lift.</div></div>
        <div class="metric"><span class="metric-label">Investment priority</span><span class="metric-value">${executiveSummary.averageInvestmentPriority}</span><div class="metric-copy">How clearly each lane maps to the next funded decision.</div></div>
        <div class="metric"><span class="metric-label">Benchmark delta</span><span class="metric-value">${executiveSummary.averageBenchmarkDelta}</span><div class="metric-copy">Average modeled distance from peer expectations across the portfolio.</div></div>
        <div class="metric"><span class="metric-label">Dollars at risk</span><span class="metric-value">$${formatNumber(executiveSummary.dollarsAtRiskMillions)}M</span><div class="metric-copy">Modeled annualized value at risk if the current benchmark gaps stay unresolved.</div></div>
      </div>
      <section class="section">
        <h2>Benchmark lane</h2>
        <p>Each benchmark track keeps the audience, owner, benchmark theme, core question, and next benchmark decision visible before leadership enters a board or investor room.</p>
        <div class="grid">${cards}</div>
      </section>
      <section class="table-wrap">
        <h2>Risk map</h2>
        <p>The risk map keeps peer gaps, blind spots, thin evidence packs, and vague investment logic visible before a benchmark claim collapses under diligence pressure.</p>
        <table>
          <thead><tr><th>Audience</th><th>Code</th><th>Severity</th><th>Message</th></tr></thead>
          <tbody>${riskRows}</tbody>
        </table>
      </section>
    `,
    "Executive benchmark surface for peer-relative exposure, savings potential, investment priority, and portfolio proof."
  );
}

export function renderBenchmarkLane() {
  const cards = benchmarkLane()
    .map(
      (item) => `<article class="card">
        <span class="pill">${escapeHtml(item.benchmarkStatus)}</span>
        <h3>${escapeHtml(item.audience)}</h3>
        <p><strong>Owner:</strong> ${escapeHtml(item.owner)}</p>
        <p><strong>Theme:</strong> ${escapeHtml(item.benchmarkTheme)}</p>
        <p><strong>Question:</strong> ${escapeHtml(item.boardQuestion)}</p>
        <p><strong>Gap:</strong> ${escapeHtml(item.gapSummary)}</p>
        <p><strong>Decision:</strong> ${escapeHtml(item.nextBenchmarkDecision)}</p>
      </article>`
    )
    .join("");

  return shell(
    "Benchmark lane",
    "/benchmark-lane",
    `
      <h1>Keep every benchmark claim, gap, and next investment visible.</h1>
      <p class="lede">The benchmark-lane view shows which portfolio narratives are ahead of peers, which are within range, which need catch-up work, and which still sit in a blind spot.</p>
      <section class="section">
        <h2>Benchmark queue</h2>
        <div class="grid">${cards}</div>
      </section>
    `,
    "Benchmark-lane view for portfolio peer positioning, gap summaries, and next executive benchmark decisions."
  );
}

export function renderPeerGaps() {
  const rows = peerGaps()
    .map(
      (item) => `<tr><td>${escapeHtml(item.owner)}</td><td>${escapeHtml(item.audience)}</td><td>${escapeHtml(item.benchmarkTheme)}</td><td>${item.exposureScore}</td><td>${item.confidenceScore}</td><td>${escapeHtml(item.gapSummary)}</td><td>${escapeHtml(item.peerComparisons.join(", "))}</td></tr>`
    )
    .join("");

  return shell(
    "Peer gaps",
    "/peer-gaps",
    `
      <h1>See where the portfolio still trails peer expectations.</h1>
      <p class="lede">Peer gaps keep exposure, confidence, and comparison categories readable before leadership overstates a benchmark claim or underfunds a weak lane.</p>
      <section class="table-wrap">
        <h2>Gap matrix</h2>
        <table>
          <thead><tr><th>Owner</th><th>Audience</th><th>Benchmark theme</th><th>Exposure</th><th>Confidence</th><th>Gap summary</th><th>Peer comparisons</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `,
    "Peer-gap matrix for benchmark exposure, confidence, and competitive proof packaging."
  );
}

export function renderInvestmentWaterfall() {
  const rows = investmentWaterfall()
    .map(
      (item) => `<tr><td>${escapeHtml(item.audience)}</td><td>${escapeHtml(item.owner)}</td><td>${item.savingsPotentialScore}</td><td>${item.investmentPriorityScore}</td><td>${item.urgencyScore}</td><td>${escapeHtml(item.companyTags.join(", "))}</td><td>${escapeHtml(item.relatedSurfaces.join(", "))}</td></tr>`
    )
    .join("");

  return shell(
    "Investment waterfall",
    "/investment-waterfall",
    `
      <h1>Rank savings, investment priority, and urgency in one executive waterfall.</h1>
      <p class="lede">The investment-waterfall view shows which benchmark lanes can argue for savings now, which require capital next, and where urgency will outpace the current evidence pack.</p>
      <section class="table-wrap">
        <h2>Waterfall matrix</h2>
        <table>
          <thead><tr><th>Audience</th><th>Owner</th><th>Savings</th><th>Priority</th><th>Urgency</th><th>Company tags</th><th>Related surfaces</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `,
    "Investment-waterfall matrix for benchmark savings potential, urgency, and portfolio investment sequencing."
  );
}

export function renderVerification() {
  const items = verification().map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return shell(
    "Verification",
    "/verification",
    `
      <h1>Verification posture stays explicit.</h1>
      <p class="lede">This benchmark surface is synthetic, read-only, and reproducible from the included sample export. This page keeps those guardrails visible before the repo is shown externally.</p>
      <section class="section"><h2>Verification notes</h2><ul>${items}</ul></section>
    `,
    "Verification notes for the synthetic benchmark surface, sample export, and read-only executive workflow."
  );
}

export function renderDocs() {
  return shell(
    "Docs",
    "/docs",
    `
      <h1>Portfolio Benchmark Waterfall docs</h1>
      <p class="lede">This repo packages peer-relative exposure, savings potential, investment priority, and benchmark-safe narratives into one executive surface.</p>
      <section class="section">
        <h2>Core routes</h2>
        <ul>
          <li><code>/benchmark-lane</code> keeps owners, benchmark themes, and next decisions visible.</li>
          <li><code>/peer-gaps</code> shows where the portfolio still trails peer expectations.</li>
          <li><code>/investment-waterfall</code> compares savings, investment priority, and urgency.</li>
          <li><code>/verification</code> makes the synthetic and read-only posture explicit.</li>
        </ul>
      </section>
    `,
    "Product documentation for Portfolio Benchmark Waterfall and its benchmark routes."
  );
}

export function renderSample() {
  return JSON.stringify(toExport(samplePortfolioBenchmarkWaterfall, payload().generatedAt), null, 2);
}

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { renderBenchmarkLane, renderDocs, renderInvestmentWaterfall, renderOverview, renderPeerGaps, renderVerification } from "../src/services/render.js";
import { benchmarkLane, investmentWaterfall, payload, peerGaps, riskMap, summary, verification } from "../src/services/verticalBriefService.js";

const root = path.resolve("site");
mkdirSync(root, { recursive: true });

if (existsSync("CNAME")) {
  writeFileSync(path.join(root, "CNAME"), readFileSync("CNAME", "utf8").trim() + "\n");
}

const htmlRoutes = new Map<string, [string, string]>([
  ["/", ["index.html", renderOverview()]],
  ["/benchmark-lane", ["benchmark-lane/index.html", renderBenchmarkLane()]],
  ["/peer-gaps", ["peer-gaps/index.html", renderPeerGaps()]],
  ["/investment-waterfall", ["investment-waterfall/index.html", renderInvestmentWaterfall()]],
  ["/verification", ["verification/index.html", renderVerification()]],
  ["/docs", ["docs/index.html", renderDocs()]]
]);

for (const [, [target, html]] of htmlRoutes) {
  const filePath = path.join(root, target);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, html);
}

writeFileSync(path.join(root, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://benchmark.kineticgain.com/sitemap.xml\n");
writeFileSync(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://benchmark.kineticgain.com/</loc></url><url><loc>https://benchmark.kineticgain.com/benchmark-lane/</loc></url><url><loc>https://benchmark.kineticgain.com/peer-gaps/</loc></url><url><loc>https://benchmark.kineticgain.com/investment-waterfall/</loc></url><url><loc>https://benchmark.kineticgain.com/verification/</loc></url><url><loc>https://benchmark.kineticgain.com/docs/</loc></url></urlset>`
);

const api = {
  "api/dashboard/summary.json": summary(),
  "api/benchmark-lane.json": benchmarkLane(),
  "api/peer-gaps.json": peerGaps(),
  "api/investment-waterfall.json": investmentWaterfall(),
  "api/risk-map.json": riskMap(),
  "api/verification.json": verification(),
  "api/sample.json": payload().sample,
  "api/payload.json": payload()
};

for (const [target, data] of Object.entries(api)) {
  const filePath = path.join(root, target);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

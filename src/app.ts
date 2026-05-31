import express from "express";
import {
  renderBenchmarkLane,
  renderDocs,
  renderInvestmentWaterfall,
  renderOverview,
  renderPeerGaps,
  renderSample,
  renderVerification
} from "./services/render.js";
import { benchmarkLane, investmentWaterfall, payload, peerGaps, riskMap, summary, verification } from "./services/verticalBriefService.js";

export function createApp() {
  const app = express();

  app.get("/", (_req, res) => res.type("html").send(renderOverview()));
  app.get("/benchmark-lane", (_req, res) => res.type("html").send(renderBenchmarkLane()));
  app.get("/peer-gaps", (_req, res) => res.type("html").send(renderPeerGaps()));
  app.get("/investment-waterfall", (_req, res) => res.type("html").send(renderInvestmentWaterfall()));
  app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
  app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

  app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
  app.get("/api/benchmark-lane", (_req, res) => res.json(benchmarkLane()));
  app.get("/api/peer-gaps", (_req, res) => res.json(peerGaps()));
  app.get("/api/investment-waterfall", (_req, res) => res.json(investmentWaterfall()));
  app.get("/api/risk-map", (_req, res) => res.json(riskMap()));
  app.get("/api/verification", (_req, res) => res.json(verification()));
  app.get("/api/sample", (_req, res) => res.json(payload().sample));
  app.get("/api/payload", (_req, res) => res.json(payload()));
  app.get("/sample.json", (_req, res) => res.type("json").send(renderSample()));

  return app;
}

export function startServer(port = Number(process.env.PORT ?? 3000)) {
  return createApp().listen(port, () => {
    console.log(`portfolio-benchmark-waterfall listening on http://127.0.0.1:${port}`);
  });
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  startServer();
}

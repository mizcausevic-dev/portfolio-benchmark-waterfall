import { describe, expect, it } from "vitest";
import { analyze } from "../src/analyze.js";
import { samplePortfolioBenchmarkWaterfall } from "../src/data/sampleVerticalBrief.js";

describe("analyze", () => {
  it("returns the expected item count", () => {
    const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:40:00Z" });
    expect(report.items).toBe(7);
  });

  it("computes positive benchmark metrics", () => {
    const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:40:00Z" });
    expect(report.averageExposureScore).toBeGreaterThan(0);
    expect(report.averageConfidence).toBeGreaterThan(0);
    expect(report.averageInvestmentPriority).toBeGreaterThan(0);
    expect(report.averageUrgency).toBeGreaterThan(0);
  });

  it("counts leading and blind-spot tracks", () => {
    const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:40:00Z" });
    expect(report.leadingTracks).toBeGreaterThanOrEqual(1);
    expect(report.blindSpotTracks).toBeGreaterThanOrEqual(1);
  });

  it("emits peer-gap and blind-spot findings", () => {
    const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:40:00Z" });
    expect(report.findingsList.some((finding) => finding.code === "peer-gap")).toBe(true);
    expect(report.findingsList.some((finding) => ["blind-spot-cluster", "thin-evidence-pack", "investment-misalignment"].includes(finding.code))).toBe(true);
  });

  it("rolls up dollars at risk", () => {
    const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:40:00Z" });
    expect(report.dollarsAtRiskMillions).toBeGreaterThan(0);
  });
});

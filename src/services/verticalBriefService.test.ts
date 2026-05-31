import { describe, expect, it } from "vitest";
import { benchmarkLane, investmentWaterfall, payload, peerGaps, riskMap, summary, verification } from "./verticalBriefService.js";

describe("portfolio benchmark service", () => {
  it("returns an executive summary", () => {
    expect(summary().items).toBeGreaterThan(0);
  });

  it("returns the benchmark lane", () => {
    expect(benchmarkLane()[0]?.audience).toBeTruthy();
  });

  it("returns the peer gaps view", () => {
    expect(peerGaps()[0]?.exposureScore).toBeGreaterThan(0);
  });

  it("returns the investment waterfall view", () => {
    expect(investmentWaterfall()[0]?.investmentPriorityScore).toBeGreaterThan(0);
  });

  it("keeps the benchmark headline in the investment waterfall", () => {
    expect(investmentWaterfall()[0]?.benchmarkHeadline).toBeTruthy();
  });

  it("returns the risk map", () => {
    expect(riskMap().length).toBeGreaterThan(0);
  });

  it("returns verification notes", () => {
    expect(verification().length).toBeGreaterThan(0);
    expect(payload().verification.length).toBeGreaterThan(0);
  });
});

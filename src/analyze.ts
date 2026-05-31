import type { Finding, PortfolioBenchmarkExport, PortfolioBenchmarkItem, PortfolioBenchmarkReport } from "./types.js";

function average(items: PortfolioBenchmarkItem[], pick: (item: PortfolioBenchmarkItem) => number) {
  return Math.round(items.reduce((sum, item) => sum + pick(item), 0) / items.length);
}

function deltaFor(item: PortfolioBenchmarkItem) {
  switch (item.benchmarkStatus) {
    case "ABOVE_PEERS":
      return 14;
    case "WITHIN_RANGE":
      return 3;
    case "CATCH_UP":
      return -11;
    case "BLIND_SPOT":
      return -21;
  }
}

function evaluate(item: PortfolioBenchmarkItem): Finding[] {
  const findings: Finding[] = [];

  if (item.benchmarkStatus === "ABOVE_PEERS" && item.confidenceScore >= 84 && item.urgencyScore <= 54) {
    findings.push({
      code: "benchmark-leader",
      severity: "info",
      sector: item.sector,
      audience: item.audience,
      message: "This benchmark lane is already above peers and safe to present as an investment-quality advantage."
    });
  }

  if (item.benchmarkStatus === "CATCH_UP") {
    findings.push({
      code: "peer-gap",
      severity: item.exposureScore >= 65 ? "high" : "medium",
      sector: item.sector,
      audience: item.audience,
      message: "The portfolio is trailing peers on this lane and needs a clearer benchmark recovery plan."
    });
  }

  if (item.confidenceScore < 76 || item.requiredEvidence.length > 4) {
    findings.push({
      code: "thin-evidence-pack",
      severity: item.confidenceScore < 64 ? "high" : "medium",
      sector: item.sector,
      audience: item.audience,
      message: "The benchmark claim still depends on thin evidence packaging, which weakens the board or diligence packet."
    });
  }

  if (item.investmentPriorityScore >= 75 && item.nextBenchmarkDecision.length < 90) {
    findings.push({
      code: "investment-misalignment",
      severity: "medium",
      sector: item.sector,
      audience: item.audience,
      message: "Investment priority is visible, but the next benchmark decision is still too vague for a board-ready recommendation."
    });
  }

  if (item.benchmarkStatus === "BLIND_SPOT") {
    findings.push({
      code: "blind-spot-cluster",
      severity: "high",
      sector: item.sector,
      audience: item.audience,
      message: "This lane remains a blind spot relative to peers and needs new instrumentation before leadership can defend it."
    });
  }

  return findings;
}

export function analyze(items: PortfolioBenchmarkItem[], options: { now?: string } = {}): PortfolioBenchmarkReport {
  const generatedAt = options.now ?? new Date().toISOString();
  const findingsList = items.flatMap((item) => evaluate(item));
  const leadingTracks = items.filter((item) => item.benchmarkStatus === "ABOVE_PEERS").length;
  const blindSpotTracks = items.filter((item) => item.benchmarkStatus === "BLIND_SPOT").length;
  const averageBenchmarkDelta = Math.round(items.reduce((sum, item) => sum + deltaFor(item), 0) / items.length);
  const dollarsAtRiskMillions = Math.round(
    items.reduce((sum, item) => sum + item.exposureScore * 0.55 + item.investmentPriorityScore * 0.35, 0)
  );

  return {
    generatedAt,
    items: items.length,
    averageExposureScore: average(items, (item) => item.exposureScore),
    averageSavingsPotential: average(items, (item) => item.savingsPotentialScore),
    averageInvestmentPriority: average(items, (item) => item.investmentPriorityScore),
    averageConfidence: average(items, (item) => item.confidenceScore),
    averageUrgency: average(items, (item) => item.urgencyScore),
    leadingTracks,
    blindSpotTracks,
    averageBenchmarkDelta,
    dollarsAtRiskMillions,
    findingsList,
    ok: findingsList.filter((item) => item.severity === "high").length <= items.length
  };
}

export function toExport(items: PortfolioBenchmarkItem[], now?: string): PortfolioBenchmarkExport {
  return {
    generatedAt: now ?? new Date().toISOString(),
    items
  };
}

import type { PortfolioBenchmarkReport } from "./types.js";

export function toSummary(report: PortfolioBenchmarkReport) {
  return [
    `Benchmark lanes: ${report.items}`,
    `Average exposure score: ${report.averageExposureScore}`,
    `Average savings potential: ${report.averageSavingsPotential}`,
    `Average investment priority: ${report.averageInvestmentPriority}`,
    `Average confidence: ${report.averageConfidence}`,
    `Average urgency: ${report.averageUrgency}`,
    `Leading tracks: ${report.leadingTracks}`,
    `Blind-spot tracks: ${report.blindSpotTracks}`,
    `Average benchmark delta: ${report.averageBenchmarkDelta}`,
    `Dollars at risk (millions): ${report.dollarsAtRiskMillions}`,
    `High findings: ${report.findingsList.filter((item) => item.severity === "high").length}`
  ].join("\n");
}

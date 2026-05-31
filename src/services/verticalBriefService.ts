import { analyze } from "../analyze.js";
import { samplePortfolioBenchmarkWaterfall } from "../data/sampleVerticalBrief.js";

const report = analyze(samplePortfolioBenchmarkWaterfall, { now: "2026-05-31T23:59:00Z" });

export function summary() {
  const highFindings = report.findingsList.filter((item) => item.severity === "high").length;
  return {
    items: report.items,
    averageExposureScore: report.averageExposureScore,
    averageSavingsPotential: report.averageSavingsPotential,
    averageInvestmentPriority: report.averageInvestmentPriority,
    averageConfidence: report.averageConfidence,
    averageUrgency: report.averageUrgency,
    leadingTracks: report.leadingTracks,
    blindSpotTracks: report.blindSpotTracks,
    averageBenchmarkDelta: report.averageBenchmarkDelta,
    dollarsAtRiskMillions: report.dollarsAtRiskMillions,
    highFindings,
    recommendation:
      "Protect the AI and biotech benchmark lead, compress revenue and procurement into clearer savings waterfalls, and assign one owner to close the public-sector blind spot."
  };
}

export function benchmarkLane() {
  return samplePortfolioBenchmarkWaterfall.map((item) => ({
    owner: item.owner,
    audience: item.audience,
    benchmarkStatus: item.benchmarkStatus,
    benchmarkTheme: item.benchmarkTheme,
    boardQuestion: item.boardQuestion,
    gapSummary: item.gapSummary,
    nextBenchmarkDecision: item.nextBenchmarkDecision
  }));
}

export function peerGaps() {
  return samplePortfolioBenchmarkWaterfall.map((item) => ({
    owner: item.owner,
    audience: item.audience,
    benchmarkTheme: item.benchmarkTheme,
    exposureScore: item.exposureScore,
    confidenceScore: item.confidenceScore,
    gapSummary: item.gapSummary,
    currentPosition: item.currentPosition,
    companyTags: item.companyTags,
    peerComparisons: item.peerComparisons
  }));
}

export function investmentWaterfall() {
  return samplePortfolioBenchmarkWaterfall.map((item) => ({
    audience: item.audience,
    owner: item.owner,
    savingsPotentialScore: item.savingsPotentialScore,
    investmentPriorityScore: item.investmentPriorityScore,
    urgencyScore: item.urgencyScore,
    benchmarkHeadline: item.benchmarkHeadline,
    companyTags: item.companyTags,
    relatedSurfaces: item.relatedSurfaces,
    requiredEvidence: item.requiredEvidence
  }));
}

export function riskMap() {
  const order = { high: 0, medium: 1, low: 2, info: 3 } as const;
  return [...report.findingsList].sort((a, b) => order[a.severity] - order[b.severity] || a.code.localeCompare(b.code));
}

export function verification() {
  return [
    "Synthetic benchmark data only - no live board packets, investor packs, or internal company benchmarks are included.",
    "Exposure, savings, investment priority, urgency, and benchmark-delta metrics are modeled from the sample executive-intelligence set in this repo.",
    "This surface is read-only and designed to show how Kinetic Gain can rank portfolio lanes against peer expectations and board questions.",
    "Company tags and peer-comparison labels are synthetic design aids rather than audited market evidence.",
    "Every route and packet is reproducible from the included sample export."
  ];
}

export function payload() {
  return {
    generatedAt: report.generatedAt,
    summary: summary(),
    benchmarkLane: benchmarkLane(),
    peerGaps: peerGaps(),
    investmentWaterfall: investmentWaterfall(),
    riskMap: riskMap(),
    verification: verification(),
    sample: samplePortfolioBenchmarkWaterfall
  };
}

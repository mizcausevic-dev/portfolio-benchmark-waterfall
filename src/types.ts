export type BenchmarkSector =
  | "AI_PLATFORM"
  | "CLOUD_IDENTITY"
  | "REVENUE_SYSTEMS"
  | "FINTECH"
  | "BIOTECH_DIAGNOSTICS"
  | "PROCUREMENT_TRUST"
  | "PUBLIC_SECTOR";

export type BenchmarkStatus = "ABOVE_PEERS" | "WITHIN_RANGE" | "CATCH_UP" | "BLIND_SPOT";

export interface PortfolioBenchmarkItem {
  id: string;
  owner: string;
  audience: string;
  sector: BenchmarkSector;
  benchmarkStatus: BenchmarkStatus;
  benchmarkTheme: string;
  boardQuestion: string;
  currentPosition: string;
  gapSummary: string;
  exposureScore: number;
  savingsPotentialScore: number;
  investmentPriorityScore: number;
  confidenceScore: number;
  urgencyScore: number;
  benchmarkHeadline: string;
  benchmarkNarrative: string;
  nextBenchmarkDecision: string;
  companyTags: string[];
  peerComparisons: string[];
  relatedSurfaces: string[];
  requiredEvidence: string[];
}

export interface PortfolioBenchmarkExport {
  generatedAt: string;
  items: PortfolioBenchmarkItem[];
}

export type FindingCode =
  | "benchmark-leader"
  | "peer-gap"
  | "thin-evidence-pack"
  | "investment-misalignment"
  | "blind-spot-cluster";

export interface Finding {
  code: FindingCode;
  severity: "high" | "medium" | "low" | "info";
  sector: BenchmarkSector;
  audience: string;
  message: string;
}

export interface PortfolioBenchmarkReport {
  generatedAt: string;
  items: number;
  averageExposureScore: number;
  averageSavingsPotential: number;
  averageInvestmentPriority: number;
  averageConfidence: number;
  averageUrgency: number;
  leadingTracks: number;
  blindSpotTracks: number;
  averageBenchmarkDelta: number;
  dollarsAtRiskMillions: number;
  findingsList: Finding[];
  ok: boolean;
}

import { writeFileSync } from "node:fs";
import { toExport } from "../src/analyze.js";
import { samplePortfolioBenchmarkWaterfall } from "../src/data/sampleVerticalBrief.js";

const clean = samplePortfolioBenchmarkWaterfall.map((item) => ({
  ...item,
  companyTags: [],
  relatedSurfaces: [],
  peerComparisons: [],
  requiredEvidence: []
}));

writeFileSync(
  "fixtures/portfolio-benchmark-waterfall.json",
  JSON.stringify(toExport(samplePortfolioBenchmarkWaterfall), null, 2)
);
writeFileSync(
  "fixtures/portfolio-benchmark-waterfall-clean.json",
  JSON.stringify(toExport(clean), null, 2)
);

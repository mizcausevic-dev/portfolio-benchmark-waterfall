import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("portfolio-benchmark-waterfall app", () => {
  it("serves the HTML routes", async () => {
    const htmlRoutes = ["/", "/benchmark-lane", "/peer-gaps", "/investment-waterfall", "/verification", "/docs"];

    for (const route of htmlRoutes) {
      const response = await request(createApp()).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/html/);
    }
  });

  it("serves the JSON routes", async () => {
    const jsonRoutes = [
      "/api/dashboard/summary",
      "/api/benchmark-lane",
      "/api/peer-gaps",
      "/api/investment-waterfall",
      "/api/risk-map",
      "/api/verification",
      "/api/sample",
      "/api/payload"
    ];

    for (const route of jsonRoutes) {
      const response = await request(createApp()).get(route);
      expect(response.status).toBe(200);
    }
  });
});

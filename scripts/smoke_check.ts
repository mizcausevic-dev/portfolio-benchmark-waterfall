import { createApp } from "../src/app.js";

const app = createApp();
const server = app.listen(0, async () => {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to resolve local server address.");
  }

  const base = `http://127.0.0.1:${address.port}`;
  const htmlRoutes = ["/", "/benchmark-lane", "/peer-gaps", "/investment-waterfall", "/verification", "/docs"];
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

  for (const route of [...htmlRoutes, ...jsonRoutes]) {
    const response = await fetch(`${base}${route}`);
    if (!response.ok) {
      throw new Error(`Smoke check failed for ${route}: ${response.status}`);
    }
  }

  server.close();
});

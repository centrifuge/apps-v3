import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  },

  compatibilityDate: "2025-04-04",
});

import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  return {
    message: "Hello from Nitro!",
    timestamp: new Date().toISOString(),
  };
});

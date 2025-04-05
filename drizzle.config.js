import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_BJSqpgNCbo26@ep-square-scene-a8znqeh0-pooler.eastus2.azure.neon.tech/ai-interview-mocker?sslmode=require",
  },
});

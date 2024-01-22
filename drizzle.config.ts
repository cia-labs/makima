import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    uri: process.env.DATABASE_URL,
  },
} satisfies Config;

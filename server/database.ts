import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { Pool } from "pg";

if (existsSync(".env")) {
  loadEnvFile();
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

export const pool = new Pool({ connectionString });

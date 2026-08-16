import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function resolveMigrationsDir() {
  const candidates = [
    path.join(__dirname, "migrations"),
    path.join(__dirname, "..", "src", "migrations"),
  ];

  for (const candidate of candidates) {
    try {
      const entries = await fs.readdir(candidate);
      if (entries.some((entry) => entry.endsWith(".sql"))) return candidate;
    } catch {
      // Try the next supported build/source location.
    }
  }

  throw new Error(`SQL migrations not found. Checked: ${candidates.join(", ")}`);
}

export async function runMigrations() {
  const migrationsDir = await resolveMigrationsDir();
  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort();
  if (sqlFiles.length === 0) throw new Error(`No SQL migrations found in ${migrationsDir}`);

  for (const file of sqlFiles) {
    const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Migration applied: ${file}`);
  }
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  runMigrations()
    .then(async () => {
      await pool.end();
      console.log("All migrations completed successfully");
    })
    .catch(async (error) => {
      console.error("Migration failed:", error);
      await pool.end().catch(() => undefined);
      process.exit(1);
    });
}

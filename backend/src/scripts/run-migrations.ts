import { Client } from "pg";
import fs from "fs/promises";
import path from "path";

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");
const TABLE_NAME = "schema_migrations";

async function ensureMigrationsTable(client: any) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      run_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

async function getApplied(client: any) {
  const res = await client.query(`SELECT name FROM ${TABLE_NAME}`);
  return new Set(res.rows.map((r: { name: any }) => r.name));
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required");
    process.exit(1);
  }

  let files;
  try {
    files = await fs.readdir(MIGRATIONS_DIR);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.log("No migrations directory; nothing to run.");
      process.exit(0);
    }
    throw err;
  }

  files = files.filter((f) => f.endsWith(".sql")).sort();

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await ensureMigrationsTable(client);
    const applied = await getApplied(client);

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`skip ${file}`);
        continue;
      }

      const sql = await fs.readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`running ${file}...`);
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query(`INSERT INTO ${TABLE_NAME} (name) VALUES ($1)`, [
          file,
        ]);
        await client.query("COMMIT");
        console.log(`applied ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`failed ${file}:`, err);
        throw err;
      }
    }

    console.log("migrations complete");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

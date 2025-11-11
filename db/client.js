import pg from "pg";

// Prefer DATABASE_URL when present (set via --env-file or CI). Fall back to
// a local 'market' database so tests and local scripts don't depend on an
// external env file. Had to get help to get past this issue.
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/market";

const db = new pg.Client({ connectionString });
export default db;

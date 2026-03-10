import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/tododb",
});

export default pool;
import { pool } from "./database.js";
import { seedTransactions } from "./data/seedTransactions.js";

const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL CHECK (btrim(description) <> ''),
      amount NUMERIC NOT NULL CHECK (amount > 0),
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      category TEXT NOT NULL CHECK (btrim(category) <> ''),
      date DATE NOT NULL
    )
  `);

  for (const transaction of seedTransactions) {
    await client.query(
      `
        INSERT INTO transactions (
          id,
          description,
          amount,
          type,
          category,
          date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        transaction.id,
        transaction.description,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date,
      ]
    );
  }

  await client.query("COMMIT");
  console.log("Database setup completed.");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}

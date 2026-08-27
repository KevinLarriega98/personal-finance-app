import express from "express";
import { randomUUID } from "node:crypto";
import type { ErrorRequestHandler } from "express";

import { pool } from "./database.js";
import type { Transaction } from "./types/transaction.js";

type TransactionInput = Omit<Transaction, "id">;
type TransactionRow = Omit<Transaction, "amount"> & {
  amount: string;
};

const transactionColumns = `
  id,
  description,
  amount::text AS amount,
  type,
  category,
  to_char(date, 'YYYY-MM-DD') AS date
`;

function toTransaction(row: TransactionRow): Transaction {
  return {
    ...row,
    amount: Number(row.amount),
  };
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function isTransactionInput(value: unknown): value is TransactionInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const transaction = value as Record<string, unknown>;

  return (
    typeof transaction.description === "string" &&
    transaction.description.trim().length > 0 &&
    typeof transaction.amount === "number" &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    (transaction.type === "income" || transaction.type === "expense") &&
    typeof transaction.category === "string" &&
    transaction.category.trim().length > 0 &&
    isValidDate(transaction.date)
  );
}

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/transactions", async (_request, response) => {
  const result = await pool.query<TransactionRow>(`
    SELECT ${transactionColumns}
    FROM transactions
  `);

  response.json(result.rows.map(toTransaction));
});

app.post("/api/transactions", async (request, response) => {
  const body: unknown = request.body;

  if (!isTransactionInput(body)) {
    response.status(400).json({ message: "Invalid transaction data." });
    return;
  }

  const result = await pool.query<TransactionRow>(
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
      RETURNING ${transactionColumns}
    `,
    [
      randomUUID(),
      body.description.trim(),
      body.amount,
      body.type,
      body.category.trim(),
      body.date,
    ]
  );
  const [createdTransaction] = result.rows;

  if (!createdTransaction) {
    throw new Error("The transaction could not be created.");
  }

  response.status(201).json(toTransaction(createdTransaction));
});

app.put("/api/transactions/:id", async (request, response) => {
  const body: unknown = request.body;

  if (!isTransactionInput(body)) {
    response.status(400).json({ message: "Invalid transaction data." });
    return;
  }

  const result = await pool.query<TransactionRow>(
    `
      UPDATE transactions
      SET
        description = $2,
        amount = $3,
        type = $4,
        category = $5,
        date = $6
      WHERE id = $1
      RETURNING ${transactionColumns}
    `,
    [
      request.params.id,
      body.description.trim(),
      body.amount,
      body.type,
      body.category.trim(),
      body.date,
    ]
  );
  const [updatedTransaction] = result.rows;

  if (!updatedTransaction) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  response.json(toTransaction(updatedTransaction));
});

app.delete("/api/transactions/:id", async (request, response) => {
  const result = await pool.query(
    "DELETE FROM transactions WHERE id = $1 RETURNING id",
    [request.params.id]
  );

  if (result.rowCount === 0) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  response.status(204).send();
});

const handleServerError: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  void _next;
  console.error(error);
  response.status(500).json({ message: "Internal server error." });
};

app.use(handleServerError);

async function startServer() {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL.", error);
    await pool.end();
    process.exitCode = 1;
  }
}

void startServer();

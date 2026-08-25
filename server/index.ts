import express from "express";
import { randomUUID } from "node:crypto";

import { transactions } from "./data/transactions.js";
import type { Transaction } from "./types/transaction.js";

type TransactionInput = Omit<Transaction, "id">;

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
    typeof transaction.date === "string" &&
    transaction.date.trim().length > 0
  );
}

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/transactions", (_request, response) => {
  response.json(transactions);
});

app.post("/api/transactions", (request, response) => {
  const body: unknown = request.body;

  if (!isTransactionInput(body)) {
    response.status(400).json({ message: "Invalid transaction data." });
    return;
  }

  const transaction: Transaction = {
    ...body,
    id: randomUUID(),
    description: body.description.trim(),
    category: body.category.trim(),
  };

  transactions.push(transaction);
  response.status(201).json(transaction);
});

app.put("/api/transactions/:id", (request, response) => {
  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === request.params.id
  );

  if (transactionIndex === -1) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  const body: unknown = request.body;

  if (!isTransactionInput(body)) {
    response.status(400).json({ message: "Invalid transaction data." });
    return;
  }

  const updatedTransaction: Transaction = {
    ...body,
    id: request.params.id,
    description: body.description.trim(),
    category: body.category.trim(),
  };

  transactions[transactionIndex] = updatedTransaction;
  response.json(updatedTransaction);
});

app.delete("/api/transactions/:id", (request, response) => {
  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === request.params.id
  );

  if (transactionIndex === -1) {
    response.status(404).json({ message: "Transaction not found." });
    return;
  }

  transactions.splice(transactionIndex, 1);
  response.status(204).send();
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

import express from "express";

import { transactions } from "./data/transactions.js";

const app = express();
const port = 3000;

app.get("/api/transactions", (_request, response) => {
  response.json(transactions);
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

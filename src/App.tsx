import { useState } from "react";

import { transactions } from "./data/transactions";
import type { Transaction } from "./types/transaction";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {
  const [transactionList, setTransactionList] = useState(transactions);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const totalIncome = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions =
    filter === "all"
      ? transactionList
      : transactionList.filter(
        (transaction) => transaction.type === filter
      );

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactionList((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionList((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <main>
      <h1 className="text-3xl font-bold">Personal Finance App</h1>

      <section>
        <p className="text-green-600">
          Total income: {totalIncome} €
        </p>

        <p className="text-red-600">
          Total expenses: {totalExpenses} €
        </p>

        <p>Balance: {balance} €</p>
      </section>

      <TransactionForm onAddTransaction={handleAddTransaction} />

      <label htmlFor="transaction-filter">Filter by type</label>

      <select
        id="transaction-filter"
        value={filter}
        onChange={(event) =>
          setFilter(
            event.target.value as "all" | "income" | "expense"
          )
        }
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
      />
    </main>
  );
}

export default App;
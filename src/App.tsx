import { useState } from "react";

import { transactions } from "./data/transactions";
import type { Transaction } from "./types/transaction";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {
  const [transactionList, setTransactionList] = useState(transactions);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const totalIncome = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  const filteredTransactions = transactionList.filter((transaction) => {
    const matchesType =
      filter === "all" || transaction.type === filter;

    const matchesCategory = transaction.category
      .toLowerCase()
      .includes(categoryFilter.toLowerCase());

    return matchesType && matchesCategory;
  });

  const selectedTransaction =
    transactionList.find(
      (transaction) => transaction.id === selectedTransactionId
    ) ?? null;

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactionList((currentTransactions) => [
      ...currentTransactions,
      transaction,
    ]);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactionList((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setSelectedTransactionId(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionList((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id)
    );

    if (selectedTransactionId === id) {
      setSelectedTransactionId(null);
    }
  };

  const handleEditTransaction = (id: string) => {
    setSelectedTransactionId(id);
  };

  const handleCancelEdit = () => {
    setSelectedTransactionId(null);
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

      <TransactionForm
        key={selectedTransaction?.id ?? "new"}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        transactionToEdit={selectedTransaction}
        onCancelEdit={handleCancelEdit}
      />

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

      <label htmlFor="category-filter">Filter by category</label>

      <input
        id="category-filter"
        type="text"
        value={categoryFilter}
        onChange={(event) => setCategoryFilter(event.target.value)}
        placeholder="Category"
      />

      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
      />
    </main>
  );
}

export default App;
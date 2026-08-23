import { useState } from "react";

import { transactions } from "./data/transactions";
import type { Transaction } from "./types/transaction";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";

function App() {
  const [transactionList, setTransactionList] = useState(transactions);

  const totalIncome = transactionList
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactionList
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

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

      <TransactionList
        transactions={transactionList}
        onDelete={handleDeleteTransaction}
      />
    </main>
  );
}

export default App;
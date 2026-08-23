import { useState } from "react";
import { transactions } from "./data/transactions";
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

        <p>
          Balance: {balance} €
        </p>
      </section>

      <TransactionList
        transactions={transactionList}
        onDelete={handleDeleteTransaction}
      />
    </main>
  );
}

export default App;
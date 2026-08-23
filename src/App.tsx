import { transactions } from "./data/transactions";
import TransactionList from "./components/TransactionList";

function App() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

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

      <TransactionList transactions={transactions} />
    </main>
  );
}

export default App;
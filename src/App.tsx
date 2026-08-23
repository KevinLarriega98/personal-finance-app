import { transactions } from "./data/transactions";

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

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <p>{transaction.description}</p>

            <p
              className={
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {transaction.amount} €
            </p>

            <p>{transaction.type}</p>
            <p>{transaction.category}</p>
            <p>{transaction.date}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
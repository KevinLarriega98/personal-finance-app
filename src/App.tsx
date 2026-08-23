import { transactions } from "./data/transactions";

function App() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Personal Finance App</h1>

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
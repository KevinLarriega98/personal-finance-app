import { useEffect, useState } from "react";

import type { Transaction } from "./types/transaction";

import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Select from "./components/ui/Select";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const transactionFilterOptions = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
] as const;

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTransactions = async () => {
      try {
        const response = await fetch("/api/transactions", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load transactions");
        }

        const data = (await response.json()) as Transaction[];
        setTransactionList(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setLoadError("Unable to load transactions.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadTransactions();

    return () => {
      controller.abort();
    };
  }, []);

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
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 motion-reduce:transition-none dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Personal Finance
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Track your income, expenses, and day-to-day balance in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setTheme((currentTheme) =>
                currentTheme === "light" ? "dark" : "light"
              )
            }
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            className="relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center self-start rounded-full border border-slate-300 bg-slate-200 p-1 shadow-sm transition-colors duration-200 hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <span
              aria-hidden="true"
              className={`grid size-8 place-items-center rounded-full bg-white text-base text-amber-500 shadow-sm transition-[transform,background-color,color] duration-200 motion-reduce:transition-none dark:bg-slate-600 dark:text-indigo-200 ${
                theme === "dark" ? "translate-x-10" : "translate-x-0"
              }`}
            >
              {theme === "dark" ? "☾" : "☀"}
            </span>
          </button>
        </header>

        <section
          aria-labelledby="financial-summary-title"
          className="grid gap-4 sm:grid-cols-3"
        >
          <h2 id="financial-summary-title" className="sr-only">
            Financial summary
          </h2>

          <article className="min-w-0 rounded-2xl bg-slate-900 p-5 text-white shadow-sm transition-colors duration-200 motion-reduce:transition-none dark:bg-slate-800 sm:p-6">
            <p className="text-sm font-medium text-slate-300">Balance</p>
            <p className="mt-3 wrap-break-word text-3xl font-semibold tracking-tight">
              {currencyFormatter.format(balance)}
            </p>
          </article>

          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Income</p>
            <p className="mt-3 wrap-break-word text-3xl font-semibold tracking-tight text-teal-700 dark:text-teal-400">
              {currencyFormatter.format(totalIncome)}
            </p>
          </article>

          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Expenses</p>
            <p className="mt-3 wrap-break-word text-3xl font-semibold tracking-tight text-rose-700 dark:text-rose-400">
              {currencyFormatter.format(totalExpenses)}
            </p>
          </article>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
          <div className="min-w-0">
            <TransactionForm
              key={selectedTransaction?.id ?? "new"}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              transactionToEdit={selectedTransaction}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <section
            aria-labelledby="transactions-title"
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="mb-6">
              <h2
                id="transactions-title"
                className="text-lg font-semibold text-slate-900 dark:text-slate-100"
              >
                Transactions
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Filter your activity by type or category.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="transaction-filter"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Filter by type
                </label>

                <Select
                  id="transaction-filter"
                  label="Filter by type"
                  value={filter}
                  options={transactionFilterOptions}
                  onChange={setFilter}
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Filter by category
                </label>

                <input
                  id="category-filter"
                  type="text"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  placeholder="Category"
                  className="mt-2 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-hidden placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                />
              </div>
            </div>

            <div className="mt-6 overflow-x-hidden lg:max-h-[60vh] lg:overflow-y-auto">
              {isLoading ? (
                <div
                  role="status"
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-950"
                >
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Loading transactions...
                  </p>
                </div>
              ) : loadError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-dashed border-rose-300 bg-rose-50 px-6 py-12 text-center dark:border-rose-900 dark:bg-rose-950/50"
                >
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
                    {loadError}
                  </p>
                </div>
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onDelete={handleDeleteTransaction}
                  onEdit={handleEditTransaction}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;

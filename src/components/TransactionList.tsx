import type { Transaction } from "../types/transaction";

const currencyFormatter = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
});

type TransactionListProps = {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
};

function TransactionList({
    transactions,
    onDelete,
    onEdit,
}: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-950">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No transactions
                </p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {transactions.map((transaction) => (
                <li key={transaction.id} className="p-4 sm:p-5">
                    <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="min-w-0 wrap-break-word font-semibold text-slate-900 dark:text-slate-100">
                                    {transaction.description}
                                </p>

                                <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                        transaction.type === "income"
                                            ? "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                                    }`}
                                >
                                    {transaction.type}
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className="inline-block max-w-full wrap-break-word rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {transaction.category}
                                </span>
                                <time
                                    dateTime={transaction.date}
                                    className="text-sm text-slate-500 dark:text-slate-400"
                                >
                                    {transaction.date}
                                </time>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-3 sm:items-end">
                            <p
                                className={`text-lg font-semibold tabular-nums ${
                                    transaction.type === "income"
                                        ? "text-teal-700 dark:text-teal-400"
                                        : "text-rose-700 dark:text-rose-400"
                                }`}
                            >
                                {currencyFormatter.format(transaction.amount)}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(transaction.id)}
                                    aria-label={`Edit ${transaction.description}`}
                                    className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(transaction.id)}
                                    aria-label={`Delete ${transaction.description}`}
                                    className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/60"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default TransactionList;

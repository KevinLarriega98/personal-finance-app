import { useState, type SubmitEvent } from "react";
import type { Transaction } from "../types/transaction";
import Select from "./ui/Select";

type TransactionFormProps = {
    onAddTransaction: (
        transaction: Omit<Transaction, "id">
    ) => Promise<boolean>;
    onUpdateTransaction: (transaction: Transaction) => Promise<boolean>;
    transactionToEdit: Transaction | null;
    onCancelEdit: () => void;
};

const transactionTypeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
] as const;

function normalizeDateYear(value: string, currentYear: number) {
    const match = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return "";
    }

    const month = Number(match[2]);
    const day = Number(match[3]);

    if (month < 1 || month > 12 || day < 1) {
        return "";
    }

    const lastDayOfMonth = new Date(currentYear, month, 0).getDate();
    const normalizedDay = Math.min(day, lastDayOfMonth);

    return `${currentYear}-${String(month).padStart(2, "0")}-${String(normalizedDay).padStart(2, "0")}`;
}

function TransactionForm({
    onAddTransaction,
    onUpdateTransaction,
    transactionToEdit,
    onCancelEdit,
}: TransactionFormProps) {
    const currentYear = new Date().getFullYear();
    const latestAllowedDate = `${currentYear}-12-31`;

    const [description, setDescription] = useState(
        transactionToEdit?.description ?? ""
    );

    const [amount, setAmount] = useState(
        transactionToEdit?.amount.toString() ?? ""
    );

    const [type, setType] = useState<Transaction["type"]>(
        transactionToEdit?.type ?? "expense"
    );

    const [category, setCategory] = useState(
        transactionToEdit?.category ?? ""
    );

    const [date, setDate] = useState(
        transactionToEdit?.date ?? ""
    );

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const numericAmount = Number(amount);
        const trimmedDescription = description.trim();
        const trimmedCategory = category.trim();
        const submittedDate = new FormData(event.currentTarget).get("date");
        const normalizedDate =
            typeof submittedDate === "string"
                ? normalizeDateYear(submittedDate, currentYear)
                : "";

        if (normalizedDate !== date) {
            setDate(normalizedDate);
        }

        if (
            numericAmount <= 0 ||
            !trimmedDescription ||
            !trimmedCategory ||
            !normalizedDate
        ) {
            return;
        }

        if (transactionToEdit) {
            const updatedTransaction: Transaction = {
                id: transactionToEdit.id,
                description: trimmedDescription,
                amount: numericAmount,
                type,
                category: trimmedCategory,
                date: normalizedDate,
            };

            const wasUpdated = await onUpdateTransaction(updatedTransaction);

            if (!wasUpdated) {
                return;
            }
        } else {
            const newTransaction: Omit<Transaction, "id"> = {
                description: trimmedDescription,
                amount: numericAmount,
                type,
                category: trimmedCategory,
                date: normalizedDate,
            };

            const wasAdded = await onAddTransaction(newTransaction);

            if (!wasAdded) {
                return;
            }
        }

        setDescription("");
        setAmount("");
        setType("expense");
        setCategory("");
        setDate("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {transactionToEdit
                        ? "Edit transaction"
                        : "New transaction"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {transactionToEdit
                        ? "Update the transaction details below."
                        : "Add income or expenses to your dashboard."}
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="sm:col-span-2 lg:col-span-1">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description"
                        required
                        className="mt-2 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-hidden placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                    />
                </div>

                <div>
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Amount
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="Amount"
                        min="0.01"
                        step="0.01"
                        required
                        className="mt-2 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-hidden placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                    />
                </div>

                <div>
                    <label
                        htmlFor="type"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Type
                    </label>
                    <Select
                        id="type"
                        label="Type"
                        value={type}
                        options={transactionTypeOptions}
                        onChange={setType}
                    />
                </div>

                <div>
                    <label
                        htmlFor="category"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Category
                    </label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        placeholder="Category"
                        required
                        className="mt-2 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-hidden placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                    />
                </div>

                <div>
                    <label
                        htmlFor="date"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                        Date
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        onBlur={(event) =>
                            setDate(
                                normalizeDateYear(
                                    event.currentTarget.value,
                                    currentYear
                                )
                            )
                        }
                        max={latestAllowedDate}
                        required
                        className="mt-2 min-w-0 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:scheme-dark dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                    type="submit"
                    className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {transactionToEdit ? "Save changes" : "Add transaction"}
                </button>

                {transactionToEdit && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel edit
                    </button>
                )}
            </div>
        </form>
    );
}

export default TransactionForm;

import { useState, type SubmitEvent } from "react";
import type { Transaction } from "../types/transaction";

type TransactionFormProps = {
    onAddTransaction: (transaction: Transaction) => void;
    onUpdateTransaction: (transaction: Transaction) => void;
    transactionToEdit: Transaction | null;
    onCancelEdit: () => void;
};

function TransactionForm({
    onAddTransaction,
    onUpdateTransaction,
    transactionToEdit,
    onCancelEdit,
}: TransactionFormProps) {
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

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const numericAmount = Number(amount);

        if (numericAmount <= 0) {
            return;
        }

        if (transactionToEdit) {
            const updatedTransaction: Transaction = {
                id: transactionToEdit.id,
                description,
                amount: numericAmount,
                type,
                category,
                date,
            };

            onUpdateTransaction(updatedTransaction);
        } else {
            const newTransaction: Transaction = {
                id: crypto.randomUUID(),
                description,
                amount: numericAmount,
                type,
                category,
                date,
            };

            onAddTransaction(newTransaction);
        }

        setDescription("");
        setAmount("");
        setType("expense");
        setCategory("");
        setDate("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="description">Description</label>
            <input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                required
            />

            <label htmlFor="amount">Amount</label>
            <input
                id="amount"
                type="number"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Amount"
                min="0.01"
                step="0.01"
                required
            />

            <label htmlFor="type">Type</label>
            <select
                id="type"
                value={type}
                onChange={(event) =>
                    setType(event.target.value as Transaction["type"])
                }
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <label htmlFor="category">Category</label>
            <input
                id="category"
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Category"
                required
            />

            <label htmlFor="date">Date</label>
            <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
            />

            <button type="submit">
                {transactionToEdit ? "Save changes" : "Add transaction"}
            </button>

            {transactionToEdit && (
                <button type="button" onClick={onCancelEdit}>
                    Cancel edit
                </button>
            )}
        </form>
    );
}

export default TransactionForm;
import type { Transaction } from "../types/transaction";

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
        return <p>No hay transacciones</p>;
    }

    return (
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

                    <button
                        type="button"
                        onClick={() => onEdit(transaction.id)}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(transaction.id)}
                    >
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default TransactionList;
import type { Transaction } from "../types/transaction";

type TransactionListProps = {
    transactions: Transaction[];
};

function TransactionList({ transactions }: TransactionListProps) {
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
                </li>
            ))}
        </ul>
    );
}

export default TransactionList;
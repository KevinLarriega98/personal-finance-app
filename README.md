# Personal Finance

A responsive personal finance dashboard for tracking income, expenses, balance, and day-to-day transactions.

## Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Node.js
- Express

## MVP features

- View current balance, total income, and total expenses
- View and filter transactions by type or category
- Add, edit, and delete transactions
- Responsive layout for mobile and desktop

## Run locally

```bash
npm install
npm run dev
```

Run the API in a second terminal:

```bash
npm run server:dev
```

To check the project:

```bash
npm run lint
npm run build
npm run server:check
```

The API stores mock transactions in memory. Changes persist while Express is
running and reset to the initial data when the server restarts.

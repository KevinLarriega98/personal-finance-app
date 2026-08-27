# Personal Finance

A responsive personal finance dashboard for tracking income, expenses, balance, and day-to-day transactions.

## Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Node.js
- Express
- PostgreSQL

## MVP features

- View current balance, total income, and total expenses
- View and filter transactions by type or category
- Add, edit, and delete transactions
- Responsive layout for mobile and desktop

## Local setup

Requirements:

- Node.js
- PostgreSQL running on `localhost:5432`

Create a local PostgreSQL role and database:

```sql
CREATE ROLE personal_finance_app
WITH LOGIN
PASSWORD 'your_local_password';

CREATE DATABASE personal_finance
OWNER personal_finance_app;
```

Install the project dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and set your local connection string:

```env
DATABASE_URL=postgresql://personal_finance_app:your_password@localhost:5432/personal_finance
```

Create the `transactions` table and insert the eight initial transactions:

```bash
npm run db:setup
```

The setup is idempotent, so it can be run again without duplicating the seed
data.

Run the frontend:

```bash
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
git diff --check
```

The API stores transactions in PostgreSQL. Changes persist when Express
restarts. Vite proxies frontend requests from `/api` to Express on port 3000.

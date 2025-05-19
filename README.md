# Finance Tracker

A simple and efficient application to track your income, expenses, and savings. This project helps users manage their finances effectively by providing insights into spending habits and budgeting.

## Features

- Add and categorize income and expenses
- View detailed reports for financial analysis
- Export financial data to CSV or Excel
- User authentication (JWT-based) for secure access
- RESTful API endpoints for transactions, categories, and users
- Monthly financial review and notifications (via FCM)
- Cron jobs for scheduled tasks

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in all required values in `.env`:
     - `PORT`
     - `API_VERSION`
     - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`
     - `FIREBASE_SERVICE_ACCOUNT_KEY` (path to your Firebase service account JSON file)
     - `JWT_SECRET`, `JWT_EXPIRES_IN`

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

## Scripts

- `npm run start:dev` — Start the server in watch mode
- `npm run build` — Build the project
- `npm run lint` — Run ESLint
- `npm run format` — Format code with Prettier
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests

## Testing

- **Unit tests:**
  ```bash
  npm run test
  ```
- **End-to-end tests:**
  ```bash
  npm run test:e2e
  ```

## Project Structure

- `src/` — Main source code
- `config/` — Configuration files for app, JWT, etc.
- `test/` — Test files
- `.env.example` — Example environment variables

## Contributing

1. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
2. Commit your changes and push the branch.
3. Open a pull request for review.

---

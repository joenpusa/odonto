# Dental Management Application

A modern dental practice management solution featuring a robust Node.js backend and a responsive React frontend.

## Technologies

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (Direct connection using `mysql2`)
- **Authentication**: JWT (Access & Refresh Tokens)
- **Validation**: Zod
- **Security**: bcryptjs, helmet, cors

### Frontend
- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Variables & Responsive Design)
- **State/Routing**: React Router DOM, Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod

## Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MySQL**: v8.0 or higher

## Getting Started

Follow these steps to set up the project locally.

### 1. Database Setup

Ensure you have MySQL running. Create the database and tables as per the schema (see `backend/src` or project documentation for schema details).

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    - Create a `.env` file based on `.env.example`.
    - Update the database credentials (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`).

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

### 3. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Authentication

The project uses a secure authentication system with strict multi-tenancy.

- **Login Requirements**:
  - **Company ID** (Tax ID)
  - **User Email**
  - **Password**

- **Users**:
  - Default administrative user created securely via backend scripts.
  - Passwords are hashed using bcrypt.

## Project Structure

```
/
├── backend/     # Node.js/Express API
├── frontend/    # React/Vite Application
└── old/         # Legacy reference code (do not use)
```

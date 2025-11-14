# React JWT Authentication App

A modern React single-page application demonstrating secure JWT authentication with access tokens, refresh tokens, and automatic token refresh functionality.

**Live Demo:** [https://awad-ia04-22127435.vercel.app/](https://awad-ia04-22127435.vercel.app/)

## Features

- **JWT Authentication** - Login/logout with access and refresh tokens
- **Automatic Token Refresh** - Seamless token renewal on expiration
- **Protected Routes** - Route guards for authenticated access
- **Form Validation** - React Hook Form with real-time validation
- **Server State Management** - React Query for API calls
- **Mock API** - MSW for local development, Vercel Functions for production

## Tech Stack

- React + Vite
- React Router
- Axios with interceptors
- React Query (TanStack Query)
- React Hook Form
- MSW for local API mocking
- Vercel Serverless Functions for production

## Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/voleviettu/react-auth)

Or manually:
1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (Vercel auto-detects Vite configuration)

## Demo Credentials

**User Account:**
- Email: `user@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
src/
├── components/       # Reusable components (ProtectedRoute)
├── context/          # Auth context and state management
├── lib/              # Axios client and React Query config
├── mocks/            # MSW handlers for local development
├── pages/            # Login and Dashboard pages
└── App.jsx           # Main app with routing

api/                  # Vercel Serverless Functions
├── auth/
│   ├── login.js
│   ├── refresh.js
│   └── logout.js
├── user/
│   └── me.js
└── data/
    └── protected.js
```

## How It Works

1. **Login** - User authenticates with email/password
2. **Token Storage** - Access token in memory, refresh token in localStorage
3. **API Requests** - Axios attaches access token to all requests
4. **Auto Refresh** - On 401 error, automatically refreshes access token
5. **Logout** - Clears all tokens and redirects to login

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

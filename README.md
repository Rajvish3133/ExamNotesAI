# ExamNotes.AI

> AI-powered, exam-focused study notes for faster revision and better preparation.

ExamNotes.AI is a full-stack study platform for students who want to turn a topic into structured, exam-oriented learning material. It combines Google authentication, Gemini-powered note generation, revision support, diagrams, charts, searchable note history, PDF export, and a credit-based payment flow in one focused workspace.

## Features

### Authentication and Account Management

- Google sign-in through Firebase Authentication.
- Server-side user creation and lookup by email.
- JWT-based session token stored in an HTTP-only cookie.
- Protected client routes and authenticated API endpoints.
- Logout with server-side cookie clearing.
- User credit balance displayed throughout the authenticated experience.

### AI Study Features

- Generate notes from a topic, class or level, and exam type.
- Optional exam revision mode for concise, last-minute revision points.
- Optional Mermaid diagrams.
- Optional Recharts bar, line, or pie charts.
- Exam-oriented output with:
  - Priority-ranked subtopics.
  - Detailed Markdown notes.
  - Revision points.
  - Short and long questions.
  - A diagram question.
- Render generated Markdown, diagrams, and charts in the browser.
- Download generated results as a formatted PDF.

### Notes and History

- Save every successful generation to MongoDB.
- View a user's previously generated topics in reverse chronological order.
- Open an individual saved note without exposing another user's notes.
- Start a new generation directly from the history view.

### Credit System

- New users start with 50 credits.
- Each successful note generation costs 10 credits.
- Generation is blocked when the account has fewer than 10 credits.
- The current balance is updated in the UI after generation.

### Payment System

- Razorpay Checkout integration for purchasing credits.
- Three configured INR plans:
  - ₹100 for 50 credits.
  - ₹200 for 120 credits.
  - ₹500 for 300 credits.
- Backend order creation with plan validation.
- HMAC-SHA256 payment signature verification.
- Razorpay order ownership and paid-status validation.
- Duplicate verification protection using stored Razorpay order IDs.
- Dedicated payment success and failure pages.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, React Redux, Axios |
| Styling and UI | Tailwind CSS, `@tailwindcss/vite`, Motion, React Icons |
| Content rendering | React Markdown, Mermaid, Recharts |
| Backend | Node.js, Express 5, ES modules |
| Database | MongoDB with Mongoose |
| Authentication | Firebase Google sign-in, JWT, HTTP-only cookies, `cookie-parser` |
| Payments | Razorpay Orders API and Checkout |
| AI service | Google Gemini REST API (`gemini-3-flash-preview`) |
| PDF generation | PDFKit |
| Middleware and configuration | CORS, dotenv |
| Development | Vite, Nodemon, ESLint |
| Deployment | No deployment or hosting configuration is included in this repository. |

The server also lists `stripe` as a dependency, but there is no active Stripe route or payment flow in the current implementation.

## Project Structure

```text
ExamNotesAI/
├── client/
│   ├── public/                 # Public static assets
│   ├── src/
│   │   ├── assets/             # Application images and branding
│   │   ├── components/         # Shared UI and result-rendering components
│   │   ├── pages/              # Auth, home, notes, history, pricing, payment views
│   │   ├── redux/              # Redux store and user state slice
│   │   ├── services/           # Axios calls for user, notes, and PDF operations
│   │   ├── utils/              # Firebase initialization
│   │   ├── App.jsx             # Client routes and session bootstrap
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React, router, and Redux entry point
│   ├── index.html              # Vite HTML entry point
│   ├── package.json            # Frontend dependencies and scripts
│   └── vite.config.js          # Vite, React, and Tailwind configuration
├── server/
│   ├── controllers/            # Auth, user, notes, PDF, and credit logic
│   ├── middleware/             # JWT cookie authentication middleware
│   ├── models/                 # Mongoose user and notes schemas
│   ├── routes/                 # Express API route definitions
│   ├── services/               # Gemini API integration
│   ├── utils/                  # MongoDB connection, prompt builder, and JWT helper
│   ├── index.js                # Express app setup and server entry point
│   └── package.json            # Backend dependencies and scripts
└── README.md
```

## Application Flow

```text
Google sign-in
      ↓
Firebase returns Google profile
      ↓
Server creates or finds the user and issues a JWT cookie
      ↓
Authenticated notes workspace
      ↓
Topic + study options submitted
      ↓
Server checks credits and requests strict JSON from Gemini
      ↓
Notes are stored in MongoDB and 10 credits are deducted
      ↓
Markdown, revision points, diagrams, charts, and questions are displayed
      ↓
User can review history, export a PDF, or purchase more credits
```

On startup, the Express server loads environment variables, enables JSON and cookie parsing, configures credentialed CORS for the Vite development origin, mounts the API routers, starts listening, and connects to MongoDB using the `AI_ExamNotes` database name.

## API Reference

All routes requiring authentication read the JWT from the `token` cookie.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/google` | No | Create or find a user and issue a JWT cookie. |
| `GET` | `/api/auth/logout` | No | Clear the authentication cookie. |
| `GET` | `/api/user/currentuser` | Yes | Return the authenticated user's account and credits. |
| `POST` | `/api/notes/generate-notes` | Yes | Generate, save, and return AI notes. |
| `GET` | `/api/notes/getnotes` | Yes | List the authenticated user's saved notes. |
| `GET` | `/api/notes/:id` | Yes | Return one saved note owned by the authenticated user. |
| `POST` | `/api/pdf/generate-pdf` | Yes | Stream a generated result as `ExamNotesAI.pdf`. |
| `POST` | `/api/credit/order` | Yes | Create a Razorpay order for a valid credit plan. |
| `POST` | `/api/credit/verify` | Yes | Verify payment and add credits exactly once. |

The note-generation request accepts `topic`, `classLevel`, `examType`, `revisionMode`, `includeDiagram`, and `includeChart`. A successful response includes the generated `data`, the saved `noteId`, and `creditsLeft`.

## Razorpay Payment Integration

Credit plans are defined on the server and cannot be replaced with arbitrary amounts. The frontend asks the authenticated backend to create an order, then loads Razorpay Checkout and opens it with the returned order ID, amount, currency, and public key ID.

After Checkout returns payment details, the client sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to the verification endpoint. The server:

1. Recomputes the HMAC-SHA256 signature with `RAZORPAY_KEY_SECRET`.
2. Fetches the order from Razorpay.
3. Confirms the order belongs to the authenticated user.
4. Confirms the order is marked `paid` and contains the expected credit amount.
5. Atomically adds credits and records the order ID to prevent duplicate crediting.

The Razorpay Key ID is a public client-side identifier used to initialize Checkout. The Razorpay Secret is server-only and is used for signing and verification; it must never be exposed to the browser or committed to source control.

For development, use Razorpay Test Mode credentials and test payment methods in the Razorpay Dashboard. The application has no separate test-mode switch; the selected Razorpay account and credentials determine the environment.

## Authentication and Security

- Firebase handles the Google sign-in interaction in the browser.
- The backend trusts the submitted profile only to create or locate the application user, then signs a JWT containing the user ID.
- The JWT is sent as an HTTP-only cookie with a seven-day lifetime.
- `isAuth` verifies the cookie token before allowing access to user, notes, PDF, and credit operations.
- Note listing and single-note retrieval are scoped to `req.userId`, preventing cross-user note access through those endpoints.
- Credentialed CORS is enabled for the configured frontend origin.
- MongoDB URLs, JWT secrets, Gemini keys, and Razorpay credentials are loaded through environment variables.
- Password hashing is not part of this project because there is no password-based authentication flow.

## Environment Variables

Create a `.env` file in each application directory. Keep the values private and provide names only in documentation or deployment configuration.

### Frontend: `client/.env`

```env
VITE_FIREBASE_APIKEY=
VITE_RAZORPAY_KEY_ID=
VITE_SERVER_URL=
```

`VITE_FIREBASE_APIKEY` is read by the Firebase client configuration. `VITE_RAZORPAY_KEY_ID` is used as a frontend fallback when the backend does not return a key ID. `VITE_SERVER_URL` is a conventional deployment variable, but the current client uses the `serverUrl` constant in `client/src/App.jsx`, which points to `http://localhost:8000`; changing environments therefore requires updating that implementation or adding configuration support.

### Backend: `server/.env`

```env
PORT=
MONGODB_URL=
JWT_SECRET=
GEMINI_API_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

`PORT` defaults to `8000` when omitted. The server requires the MongoDB URL, JWT secret, Gemini API key, and both Razorpay credentials at runtime.

## Local Development

### Prerequisites

- Node.js with npm.
- A MongoDB deployment.
- A Firebase project with Google sign-in enabled.
- A Gemini API key.
- Razorpay Test Mode credentials for payment testing.

### Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### Start the backend

```bash
cd server
npm run dev
```

The API listens on `http://localhost:8000` by default.

### Start the frontend

In a second terminal:

```bash
cd client
npm run dev
```

Vite serves the client at `http://localhost:5173` by default. The server CORS configuration currently allows this development origin and credentials are sent by Axios requests.

## Available Scripts

### Client

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

### Server

```bash
npm run dev       # Start Express with Nodemon
```

## Data Models

### User

Stores the user's name and email, current credit balance, credit availability flag, verified Razorpay order IDs, and references to saved notes. New users receive 50 credits by default.

### Notes

Stores the owning user, topic, class level, exam type, revision and visualization preferences, generated AI content, and timestamps. The content field is a flexible MongoDB value because the Gemini response is parsed JSON.

## Current Scope

ExamNotes.AI currently provides a local-development configuration and does not include automated tests, deployment manifests, CI workflows, or a production environment configuration in the repository. The generated content depends on the configured Gemini API response and should be reviewed by students before use in high-stakes exam preparation.

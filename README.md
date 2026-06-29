# Mini HCM Time Tracking System

A lightweight Human Capital Management (HCM) system for recording employee time-in/time-out, computing worked hours, overtime, night differential, lateness, and undertime.

## Live Demo

- **Frontend:** [https://hcm-time-tracking-f1a8c.web.app] ← update after deployment
- **Backend:** [https://mini-hcm-system.onrender.com] ← update after deployment

## Test Accounts

| Role     | Email         | Password      |
| -------- | ------------- | ------------- |
| Admin    | admin@hcm.com | [password123] |
| Employee | test@hcm.com  | [password]    |

> **Note:** The backend is hosted on Render's free tier. If the app feels slow on first load, wait 30 seconds for the server to wake up and try again.

## Architecture

React (Firebase Hosting)

├── Firebase Auth ← login, register, token management

├── Firestore ← read attendance and summary data

└── Express API ← punch in/out, computation, admin operations

└── Firestore ← write via Firebase Admin SDK

## Features

- **Employee**
  - Register and login with email/password
  - Punch in and punch out with live clock
  - View today's KPI summary (regular hours, OT, ND, late, undertime)
  - View 7-day attendance history

- **Admin**
  - View all employees and their daily metrics
  - Edit punch timestamps (auto-recomputes summary)
  - Generate daily and weekly reports for all employees

## Computation Logic

All time calculations run server-side in Node.js:

| Metric             | Logic                                           |
| ------------------ | ----------------------------------------------- |
| Regular Hours      | Time worked, capped at scheduled shift duration |
| Overtime           | Minutes worked beyond shift end time            |
| Night Differential | Minutes worked between 22:00–06:00              |
| Late               | Minutes between shift start and actual punch in |
| Undertime          | Minutes between actual punch out and shift end  |

## Project Structure

mini-hcm/

├── client/ ← React + Vite + Tailwind CSS

│ └── src/

│ ├── components/ ← Reusable UI components

│ ├── context/ ← AuthContext (global auth state)

│ ├── pages/ ← One file per route

│ └── services/ ← Firebase + API calls

└── server/ ← Node.js + Express

└── src/

├── config/ ← Firebase Admin SDK setup

├── controllers/ ← Request/response handlers

├── middleware/ ← Auth token verification

├── routes/ ← API route definitions

├── services/ ← Business logic + Firestore operations

└── utils/ ← Pure computation functions

## Security Notes

- Firebase ID tokens are verified server-side on every protected request via the `verifyToken` middleware
- Admin role is enforced server-side via the `requireAdmin` middleware — frontend-only role checks are not trusted
- The registration form allows role selection for demonstration purposes. In production, users would always default to the employee role and admin privileges would be granted only by an existing admin
- Service account key and environment variables are excluded from version control via `.gitignore`

## Firestore Indexes

Composite indexes are defined in `firestore.indexes.json` and can be deployed with:

```bash
firebase deploy --only firestore:indexes
```

## Git Workflow

This project follows a feature branch workflow:

- `feat/` — new features
- `fix/` — bug fixes
- `chore/` — config, cleanup, deployment

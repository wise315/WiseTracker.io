# Fintech — Investment Tracker (backend + frontend)

Short description: small fintech demo app with user auth, transfers, real-time updates via Socket.IO and Prisma (SQLite).

## Features
- User register/login (JWT)
- Transactions with `CREDIT` / `DEBIT` types
- Balance tracking (stored on user)
- Real-time events via Socket.IO
- Prisma ORM with SQLite (dev)

## Quick start (local)
1. Clone
```bash
git clone https://github.com/wise315/WiseTracker.io.git
cd fintech

## Install dependencies:
npm install

## Run Prisma migrations:
npx prisma migrate dev --name init

## Start the server:
npm run dev

Server runs on http://localhost:5000





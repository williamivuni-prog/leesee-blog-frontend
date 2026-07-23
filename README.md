# Leesee Blog Frontend

Next.js + React + Tailwind CSS frontend for the Leesee fullstack blog technical test.

## Features

- App Router project using Next.js 16
- React client interface for blog CRUD workflows
- Tailwind CSS v4 styling
- Typed API helpers
- Vitest unit test
- Vercel-ready environment variable setup

## Local Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to your backend URL. For local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The frontend will run at `http://localhost:3000`.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Deploy To Vercel

1. Push this frontend project to a public GitHub repository.
2. Import the repository in Vercel.
3. Add this environment variable:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-app.herokuapp.com
```

4. Deploy.

## Deployment URL

Replace this after deployment:

- Frontend: `https://your-vercel-app.vercel.app`

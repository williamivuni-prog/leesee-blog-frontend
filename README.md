# Leesee Blog Frontend

This is the frontend part of my Leesee technical test. It is a small blog interface built with Next.js, React, and Tailwind CSS. It connects to the Flask backend API to show posts and to create, edit, or delete them.

## Public Repository

- GitHub: `https://github.com/williamivuni-prog/leesee-blog-frontend`

## What I Built

- A page that lists blog posts
- A post preview/detail area
- A simple editor form for adding and updating posts
- Delete support for posts
- API helper functions in TypeScript
- A small unit test with Vitest
- Vercel deployment using the backend URL as an environment variable

## How To Run It Locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

In `.env.local`, the API URL should point to the backend. For local development I used:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then open `http://localhost:3000`.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## How I Deployed It

The frontend is deployed on Vercel. The important environment variable is:

```bash
NEXT_PUBLIC_API_URL=https://backend-eight-green-11.vercel.app
```

## Links

- Frontend: `https://frontend-seven-puce-33.vercel.app`
- Backend API: `https://backend-eight-green-11.vercel.app`

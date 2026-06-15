# AyaVine Wellness

Coming-soon landing page for AyaVine Wellness with email capture for the "first 100" early-access list. Built with Next.js 16 and the App Router.

## Tech Stack

- **Next.js** 16.2.7 (App Router)
- **React** 19.2.4
- **TypeScript** (strict)
- **Airtable** as the email submission store

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Environment Variables

Create a `.env.local` file:

```bash
AIRTABLE_API_KEY=your_airtable_personal_access_token
```

The subscribe route writes to Airtable base `appzgQAMezE0a20Gl`, table `Email Submissions`, with fields `Email Address` and `Submission Timestamp`.

## Project Structure

```
app/
  page.tsx                 Landing page with email capture UI
  layout.tsx               Root layout
  globals.css              Global styles
  api/subscribe/route.ts   POST endpoint that stores emails in Airtable
```

## API

### `POST /api/subscribe`

Body: `{ "email": string }`

| Status | Meaning |
|---|---|
| `200` | Email stored |
| `400` | Invalid email |
| `500` | Server misconfiguration or upstream error |

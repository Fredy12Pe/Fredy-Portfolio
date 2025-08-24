# fredyPortfolio

A Next.js 15 concept portfolio featuring detailed UX case studies (SelahReflect, Sea & Sky, ZipLearn) built with TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion, GSAP

## Local Development

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

## Structure
- `app/projects/[slug]` – individual case studies
- `components/ui` – reusable UI components (e.g., CardSpotlight, Compare)
- `src/lib/utils.ts` – utilities
- `public/` – static assets

## Notes
This is a concept project for showcasing design/UX thinking and interactions; it is not a shipped production app.

## Deployment
Pushes to `main` are ready for deployment via your platform of choice (e.g., Vercel).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

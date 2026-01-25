# Project Teapot

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy (Cloudflare Workers)

This app uses the OpenNext Cloudflare adapter.

```bash
pnpm wrangler login
pnpm run deploy
```

Other useful commands:

```bash
pnpm run preview
pnpm run upload
```

Notes:
- Deployment config lives in `wrangler.jsonc`.
- OpenNext build output is written to `.open-next/` (ignored by git).
- Static asset caching headers live in `public/_headers`.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

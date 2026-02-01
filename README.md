# Project Teapot

Live site: https://project-teapot.hr-418-teapot.workers.dev/

## What is this?

Project Teapot is a light-hearted, interactive resume scanner inspired by the website https://shop.merchant.dev/.

I built it out of curiosity after the original creator didn't publish a repo, so I reverse-engineered the frontend by inspecting page sources and network traffic.

Builder notes:
- The animations are mostly smoke and mirrors: a static background image is swapped with short video clips based on UI state. I hate to spoil the magic, but since you're reading this, you're likely interested in learning more.
- Video generation was the hardest part. I tried out RunwayML, which output decent results but struggled to follow prompts. Luckily, this initial attempt still led to the scanner-style animation.
- After researching other video gen. options, I tried Veo 3.1 via the Gemini API, and it nailed the clips on the first attempt.
- I still needed clean compositing over a static background, and ended up using the first scene of the idle animation video as the image.

## Guidance for running this locally

First install dependencies

```bash
pnpm install
```

Then run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

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

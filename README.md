# Lu Jiande

Official website project for ceramic artist Lu Jiande.  
The site is built as a restrained, image-led experience focused on egg-shell porcelain, bowl-centered forms, light, and material presence.

## Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Three.js and GLTFLoader for the local bowl model

## Features

- Scroll-led hero section with a photo-derived, interactive 3D porcelain bowl
- Four inner routes: `Works`, `Collections`, `News`, `About`
- Homepage remains a pure exhibition surface; `View Works` acts as the transition into the inner pages
- Wide gallery layouts tuned for mostly landscape ceramic photography
- `Works` uses ratio-aware image presentation to avoid aggressive cropping
- Minimal section structure: Entrance, Form, Light, Variation, Author, Entry
- Docker Compose deployment support
- `public/` bind-mounted in Docker for static asset updates
- Nginx reverse proxy template with placeholder domain names

## Project Structure

```text
app/                    Next.js routes and global styles
components/sections/    Homepage sections
components/site/        Shared inner-page shell
lib/data.ts             Page content and image references
public/images/          Site images and loading posters
public/models/          High-resolution and compact bowl models
scripts/                Model, texture and poster generation and checks
deploy/                 Deployment guide and Nginx template
```

## Local Development

Use Node.js 20 and npm. Install the locked dependencies and start the dev server:

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

For changes to TypeScript or the bowl model, also run:

```bash
npx tsc --noEmit
npm run check:hero-model
```

## Image Updates

All page image paths are managed in `lib/data.ts`.  
Add image files to `public/images/`, then update the matching `src` fields.

Example:

```ts
images: [
  { src: "/images/hero-1.webp", alt: "Porcelain bowl, first viewing angle" }
]
```

Preferred asset format is `webp` for production delivery.

The homepage bowl is a local, approximate 3D reconstruction, not a measured
scan. Its 200 mm diameter and 0.4 mm bowl and foot walls are modeled at scale;
the original model's approximately 13.6 mm foot height is retained. The unseen
interior and the shape of the foot are approximated. The exterior decoration is
projected from `hero-1.webp`, `hero-2.webp`, and `hero-3.webp`. Shared trees,
mountains and the red seal are aligned across the views; a narrow strip near
the foot extends adjacent photographed paint to avoid the studio background.
The interior is plain warm white. Replacing the photographs does not
automatically update the model. Rebuild and check it with:

```bash
npm run build:hero-model
npm run check:hero-model
```

The output is a high-resolution `public/models/hero-bowl.glb` and a compact
`public/models/hero-bowl-compact.glb` for touch devices or lower GPU texture
limits. Photo position and viewing-angle calibration are in
`scripts/build-hero-model.mjs` and may need adjustment for different photographs.
The website renders the inner wall evenly and omits a ground shadow; other GLB
viewers use the model's standard materials. When WebGL or the model is
unavailable, the first photograph remains visible.

The bowl rotates with the page through the first section. On desktop, drag with
the left mouse button to rotate and drag vertically with the right button to
zoom; the wheel scrolls the page. On touch screens, drag horizontally to rotate,
swipe vertically to scroll, and use two fingers to adjust the view and zoom.
Arrow keys rotate, `+` and `-` zoom, and `Home` restores the manual view. A
reduced-motion preference disables scroll rotation while retaining manual control.

The desktop, tablet and mobile loading posters are rendered from the model's initial
view so loading does not change its apparent position. After changing the model,
camera, or lighting, start the site and regenerate them with Playwright and a
Chromium browser available locally:

```bash
npm run capture:hero-posters -- http://127.0.0.1:3000
```

Set `PORCELAIN_PLAYWRIGHT` to the Playwright package path and `PORCELAIN_CHROME`
to a Chromium executable when they are not installed in the usual locations.

## Content Editing

This project currently does not use a CMS or admin backend.  
The simplest way to update page copy is to edit `lib/data.ts` directly.

Current content strategy:

- Chinese is primary
- English is secondary
- homepage remains the visual reference for tone and restraint

## Docker Deployment

The Compose service requires a `.env` file. On the deployment host, create it
from the example, then build and start the service:

```bash
test -f .env || cp .env.example .env
docker compose up --build -d
```

`APP_PORT` controls the host port and defaults to `3000`; the container listens
on port `3000`. Compose mounts the host's entire `./public` directory at
`/app/public`, replacing the public files bundled in the image. Keep the code,
both GLBs, all three loading posters and the photographs from the same revision.
If only static files change, update the host's `public/` directory and recreate
the service without rebuilding:

```bash
docker compose up -d --no-deps --no-build --force-recreate web
```

Recreating the container also clears its local Next/Image cache. Code or
dependency changes require a rebuild. See [deploy/DEPLOY.md](deploy/DEPLOY.md)
for deployment, verification and rollback steps.

## Production Notes

- `next.config.mjs` uses `output: "standalone"` for container deployment
- `deploy/nginx.conf` uses `example.com` placeholders; replace them and match the proxy port to `APP_PORT`
- `deploy/DEPLOY.md` contains the update and deploy workflow

## Domain

Target domain:

- `lujiande.com`
- `www.lujiande.com`

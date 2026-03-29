# Agent State

## Current Status

This repository now contains a production-ready Next.js 14 homepage for Lu Jiande's ceramic website.

Implemented work:

- single-page homepage with Entrance, Form, Light, Variation, Author, and Entry sections
- hero section rebuilt around three stacked bowl images with scroll-driven transitions
- hero text pinned with the image during scroll, with the background tuned to blend into the photo backdrop
- non-author gallery sections widened to better support mostly landscape ceramic photography
- variation section adjusted to use an asymmetrical layout with a vertical center image
- deployment support added with `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `.env.example`, and `deploy/nginx.conf`

## Notes

- image assets in `public/images/` have been switched toward real JPG sources where available
- `next.config.mjs` uses `output: "standalone"` for container deployment
- local production build has passed with `npm run build`

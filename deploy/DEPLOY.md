# Deployment

The existing deployment uses Docker Compose and an optional Nginx reverse
proxy. The image builds the Next.js standalone server with Node.js 20; it uses
the GLB models and loading posters already present in the repository. Building
the image needs access to the Node base image and npm packages. The running site
loads the model and photographs locally and does not need a remote 3D service.

## First Deployment

On the deployment host, check out the desired repository revision and make sure
Docker and the Compose plugin are available. From the repository root, create
`.env` if it does not already exist, then start the service:

```bash
test -f .env || cp .env.example .env
docker compose up --build -d
```

The Compose file requires `.env`. `APP_PORT` selects the host port and defaults
to `3000`; the app listens on `0.0.0.0:3000` inside the container. `NODE_ENV`
defaults to `production`. The published port binds on the host interfaces; use
the host's network policy as appropriate for the deployment.

Compose mounts the host's complete `./public` directory at `/app/public`. This
mount hides the public files copied into the image, so the checkout must include
`public/images/` and both files in `public/models/`. Keep the source photographs,
three `hero-bowl-poster*.webp` files, both GLBs and application code from the same
revision. The container does not regenerate the model or posters during its build.

## Verify and Operate

The health check requests `/` inside the container. Check the service and logs,
then request the homepage and model from the host. Replace `3000` below if
`APP_PORT` was changed in `.env`:

```bash
docker compose ps
docker compose logs --tail=100 web
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:3000/models/hero-bowl.glb
curl -I http://127.0.0.1:3000/models/hero-bowl-compact.glb
```

Check the homepage in a browser, including model loading, rotation, the white
interior and the photograph fallback. Stop the service with:

```bash
docker compose down
```

## Updates and Rollback

Before an update, check for local changes and record the current commit. Back up
any host-only changes to `.env` or `public/` before replacing them. For an update
that includes application code, dependencies or model generation changes, move
to the new revision and rebuild:

```bash
git status --short
git rev-parse HEAD
git pull --ff-only origin main
docker compose up --build -d
```

For a change limited to files already under `public/`, update the complete
corresponding files on the host and recreate the container without rebuilding:

```bash
docker compose up -d --no-deps --no-build --force-recreate web
```

Recreation clears the container's local Next/Image cache. A browser or reverse
proxy may also cache an older image; refresh or invalidate those caches as
needed. Changing `lib/data.ts`, React components or any other application code
requires the rebuild workflow above.

To roll back, restore the previously recorded repository revision and rebuild;
the mounted `public/` directory must roll back with the code. Replace
`YOUR_PREVIOUS_COMMIT` with the recorded commit and resolve or back up any local
changes before switching:

```bash
git switch --detach YOUR_PREVIOUS_COMMIT
docker compose up --build -d
```

After checking the rollback, return to the deployment branch when ready with
`git switch main` and update it using the normal workflow.

## Reverse Proxy

`deploy/nginx.conf` is an HTTP template containing `example.com` and
`www.example.com` placeholders. Replace those names with the deployed domains,
set `proxy_pass` to `http://127.0.0.1:APP_PORT` using the actual host port, and
validate the Nginx configuration before reloading it. Configure HTTPS and
certificates separately for a public deployment.

# Deployment

## Docker Compose

1. Edit `.env` if you want a port other than `3000`.
2. Build and start the site:

```bash
docker compose up --build -d
```

3. Check logs:

```bash
docker compose logs -f
```

4. Stop the service:

```bash
docker compose down
```

## Reverse Proxy

If you deploy behind Nginx, use `deploy/nginx.conf` as a starting point and replace:

- `example.com`
- `www.example.com`

Then point the proxy to `127.0.0.1:3000` and reload Nginx.

## Update Workflow

After updating code or images:

```bash
docker compose up --build -d
```

# JioNLP Frontend

Vue 3 + TypeScript + Ant Design Vue frontend for the [JioNLP](https://github.com/dongrixinyu/JioNLP) demo site.  
Serves a blog system and an interactive NLP tool playground.

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | Vue 3 + TypeScript |
| UI | Ant Design Vue 3 |
| Routing | Vue Router 4 |
| Markdown | marked.js + KaTeX |
| Build | Vue CLI 5 + Webpack 5 |
| Serve (prod) | nginx inside Docker |

---

## Project structure

```
JioNLP_frontend/
├── src/
│   ├── global_config.ts        # runtime config — reads from .env.*
│   ├── main.ts                 # app entry, marked.js setup
│   ├── router/                 # Vue Router routes
│   ├── views/                  # page-level components
│   │   ├── editblog/           # blog editor (new + edit)
│   │   └── jionlp_online/      # NLP tool pages
│   └── components/             # shared/reusable components
├── ci/
│   └── docker/
│       ├── Dockerfile          # multi-stage: Node build → nginx serve
│       ├── nginx.conf          # container nginx config
│       ├── entrypoint.sh       # starts nginx in foreground
│       └── .dockerignore
├── .env.example                # copy this; fill in values
├── .env.development            # local debug values  (git-ignored)
├── .env.production             # production values   (git-ignored)
├── vue.config.js               # Webpack + dev-server + proxy config
├── start_frontend.sh           # one-command Docker build + run
└── README.md
```

---

## 1 · First-time setup

```bash
git clone https://github.com/dongrixinyu/JioNLP_frontend.git
cd JioNLP_frontend

npm install

cp .env.example .env.development
cp .env.example .env.production
```

Open `.env.development` and `.env.production` and fill in real values.

---

## 2 · Debug (local development)

Uses `.env.development`. The webpack dev-server proxies all API calls
(`/blog_api/`, `/jio_api/`, `/blog_image/`, `/trivials/`) to the local
backend — no CORS configuration needed.

```bash
npm run serve
```

Frontend available at **http://localhost:8080** (or `VUE_APP_FRONTEND_PORT`).

> **Prerequisite:** JioNLP backend must be running on `VUE_APP_BACKEND_IP:VUE_APP_BACKEND_PORT`.

### Lint

```bash
npm run lint
```

### Bundle analyzer

```bash
USE_ANALYZER=true npm run serve
```

---

## 3 · Production build (static files only)

Uses `.env.production`. Outputs minified, gzip-compressed assets to `dist/`.

```bash
npm run build
```

---

## 4 · Deploy with Docker (recommended)

Uses `.env.production` baked in at image-build time.

```bash
# First time only
chmod +x start_frontend.sh

# Build image and run container on port 80
./start_frontend.sh

# Custom host port
./start_frontend.sh --port 8080

# Force clean rebuild
./start_frontend.sh --no-cache

# Stop and remove container
./start_frontend.sh --stop
```

Frontend available at **http://your-server-ip** after the container starts.

### Useful Docker commands

```bash
docker logs -f jionlp-frontend          # stream logs
docker exec -it jionlp-frontend sh      # open shell
docker exec jionlp-frontend nginx -t    # test nginx config
docker exec jionlp-frontend nginx -s reload   # reload nginx config
```

---

## 5 · Environment variables

| Variable | Description | Dev default | Prod example |
|---|---|---|---|
| `VUE_APP_API_ID` | MD5 salt for API request signing | `dongrixinyu` | `dongrixinyu` |
| `VUE_APP_TEXT_LENGTH` | Chars taken from body for hash | `18` | `18` |
| `VUE_APP_BACKEND_IP` | Backend IP / hostname | `127.0.0.1` | `182.92.160.94` |
| `VUE_APP_BACKEND_PORT` | Backend port | `16666` | `16666` |
| `VUE_APP_FRONTEND_IP` | Frontend IP (informational) | `127.0.0.1` | `182.92.160.94` |
| `VUE_APP_FRONTEND_PORT` | Dev-server / host port | `8080` | `80` |
| `VUE_APP_BLOG_ASSET_HOST` | Base URL for blog image links | `http://127.0.0.1:16666` | `https://www.jionlp.com` |

Copy `.env.example` to get started. **Never commit `.env.development` or `.env.production`.**

---

## 6 · How config flows through the code

```
.env.development / .env.production
        │  (injected at build time by Vue CLI)
        ▼
src/global_config.ts       ← single source of truth
        ├── src/utils/request.ts          (builds backend URL)
        ├── src/utils/authentication.ts   (hash signing)
        └── vue.config.js                 (dev-server proxy target)
```

---

## 7 · Blog image preprocessing

When writing a new post with external image URLs (e.g. from mdnice):

1. Paste markdown into the editor
2. Click **预处理图片链接** — backend downloads images, stores them under `blog_image/<blog_id>/`, rewrites URLs in editor
3. Review updated markdown
4. Click **提交文本** to publish

Skipping step 2 submits the blog with original external URLs unchanged.

---

## 8 · CI / CD overview

```
./start_frontend.sh
    ├─ docker build  (multi-stage)
    │     ├─ Stage 1: node:18-alpine — npm ci + npm run build (.env.production)
    │     └─ Stage 2: nginx:1.25-alpine — copy dist/, nginx.conf
    └─ docker run --restart unless-stopped
          ├─ nginx serves dist/ on port 80
          └─ proxies /blog_api/ /jio_api/ /blog_image/ /trivials/ → backend:16666
```

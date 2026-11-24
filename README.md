# Ops Universe — organization website

The website for [github.com/ops-universe](https://github.com/ops-universe): open-source AI engineering, forward deployment and responsible automation.

**Engineer responsibly. Deploy confidently.**

> Status: **Developer Preview.** The content reflects the organization as of the GitHub snapshot in `src/data/github-snapshot.json`. Every metric is read from the GitHub API, and every sample (simulated telemetry, example articles) is labelled in the UI.

## Stack

React 18 · TypeScript · Vite 6 · React Router 6 · Tailwind CSS 3 · Framer Motion 11 · Lucide icons · self-hosted Space Grotesk + JetBrains Mono (Fontsource)

## Quick start

Requires Node.js 20+ (22 recommended).

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run typecheck` | `tsc -b`, strict mode |
| `npm run build` | Typecheck → client build → server (SSR) build → prerender every route to static HTML |
| `npm run preview` | Serve `dist/` locally |
| `npm run snapshot` | Refresh `src/data/github-snapshot.json` from the GitHub API (Node only) |

## GitHub data

`src/lib/github.ts` calls the public GitHub REST API **from the browser, without a token**:

- `fetchOrg`, `fetchRepos`, `fetchRepo`, `fetchReadme`, `fetchContributors`, `fetchOrgContributors`, `loadOrgData`
- Typed responses (`GitHubOrg`, `GitHubRepo`, `GitHubContributor`)
- Memoized in-flight requests and a 10-minute `sessionStorage` cache
- An 8 s timeout and rate-limit detection (`x-ratelimit-remaining`, reset time)
- **Fallback:** if the API fails or is rate limited, the site uses the build-time snapshot. The UI shows which source is in use: *Live from GitHub API*, or *Snapshot · date*.

### Tokens and secrets

No token is ever shipped to the browser. Anything prefixed with `VITE_` is public, so the token is never given that prefix.

- `GITHUB_TOKEN` is read **only** by `scripts/fetch-github.mjs` (Node), which raises the rate limit while writing the snapshot. The script keeps a whitelist of public fields, so private org fields such as the billing email are never written to disk.
- `VITE_GITHUB_API_BASE` (optional) points the browser at **your own proxy**, which adds a token server side (for example a Cloudflare Worker or Vercel function).

```bash
GITHUB_TOKEN=$(gh auth token) npm run snapshot
```

### Real vs curated vs sample content

| Source | Where | Examples |
|---|---|---|
| **Live / snapshot** GitHub data | `lib/github.ts`, `data/github-snapshot.json` | Repo count, stars, forks, languages, push dates, README, contributors |
| **Curated** from repository files | `data/projects.ts`, `data/content.ts`, `lib/site.ts` | Summaries, status, roadmap, principles, funding links. Each entry names its source file. |
| **Sample**, labelled in the UI | `data/posts.ts`, `components/TelemetryPanel.tsx` | "Example article" posts (no author or date claimed); "Simulated" telemetry (synthetic random walk) |

Once maintainers set GitHub descriptions and topics, they automatically override the curated copy (`projectSummary` and `projectTags` in `lib/projects.ts`).

## File tree

```
website/
├── .env.example                  # BASE_PATH, VITE_SITE_URL, GITHUB_TOKEN (server-only), VITE_GITHUB_API_BASE
├── .github/workflows/deploy.yml  # GitHub Pages: snapshot → build → deploy (push, manual, daily)
├── index.html                    # SEO / OG / Twitter / JSON-LD, no-flash theme script
├── package.json
├── postcss.config.js
├── tailwind.config.ts            # tokens → CSS variables, type scale, keyframes
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts                # @ alias, BASE_PATH, vendor chunks
├── public/
│   ├── favicon.svg  apple-touch-icon.png
│   ├── og-image.svg og-image.png  # 1200×630
│   ├── robots.txt   sitemap.xml
├── scripts/
│   ├── fetch-github.mjs          # build-time snapshot (server-side token)
│   └── prerender.mjs             # renders each route → dist/<route>.html + 404.html
└── src/
    ├── main.tsx  App.tsx  routes.tsx  entry-server.tsx  vite-env.d.ts
    ├── layouts/RootLayout.tsx    # skip link, header, page transitions, footer, ⌘K
    ├── pages/                    # Home, Projects, About, Blog, BlogPost, Contact, NotFound
    ├── components/
    │   ├── Header.tsx  Footer.tsx  ThemeToggle.tsx  ScrollProgress.tsx  CommandPalette.tsx
    │   ├── Button.tsx  Reveal.tsx  SectionHeading.tsx  Badges.tsx  Logo.tsx
    │   ├── NetworkCanvas.tsx  HeroTerminal.tsx  TelemetryPanel.tsx  Marquee.tsx  StatCounter.tsx
    │   └── ProjectCard.tsx  ProjectModal.tsx
    ├── hooks/                    # useTheme, useOrgData, useAsync, useDocumentMeta,
    │                             # useMagnetic, useCountUp, useMediaQuery
    ├── lib/                      # github, projects, markdown (safe renderer), format, site, cn
    ├── data/                     # projects, content, posts, github-snapshot.json
    └── styles/globals.css        # design tokens (dark + light), components, prose, reduced motion
```

## Deployment

The build is static HTML in `dist/`. `BASE_PATH` controls the URL prefix.

### Prerendering

`npm run build` renders every public route with React on the server (`src/entry-server.tsx`, using the routes shared with the browser in `src/routes.tsx`) and writes the result into the client build:

| Route | File | Served with |
|---|---|---|
| `/` | `dist/index.html` | 200 |
| `/projects`, `/about`, `/blog`, `/contact` | `dist/projects.html`, … | 200 |
| `/blog/<slug>` | `dist/blog/<slug>.html` | 200 |
| anything else | `dist/404.html` (not-found page) | 404 |

Each file carries that page's title, description, robots, canonical and Open Graph tags, plus its full content, so crawlers, link previews and readers without JavaScript all get the real page. Project data in the prerendered HTML comes from the GitHub snapshot. In the browser the app then renders fresh and loads live data as usual. New routes or posts are picked up automatically through `prerenderPaths` in `entry-server.tsx`; code that runs during render must not touch `window` or `document` unguarded.

### GitHub Pages (recommended — `ops-universe.github.io`)

1. Put this folder at the root of the `ops-universe/ops-universe.github.io` repository (or merge it with the in-review website PR there).
2. In the repository, go to **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. `.github/workflows/deploy.yml` refreshes the snapshot, builds with `BASE_PATH=/`, and deploys. It also runs daily to keep the snapshot fresh.

For a project page (`https://ops-universe.github.io/<repo>/`), set `BASE_PATH=/<repo>/` in the workflow.

### Vercel

Framework: **Vite** · Build: `npm run build` · Output: `dist`. Add an SPA rewrite in `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

### Netlify

Build: `npm run build` · Publish: `dist`. Add `public/_redirects` containing `/*  /index.html  200`.

On any host, set `VITE_SITE_URL` to the final origin so canonical and Open Graph URLs are correct, and update `public/sitemap.xml` and `public/robots.txt` if the domain changes.

## Design rationale

**Visual direction.** The palette extends the organization's own tokens from [`ops-standards/design.md`](https://github.com/ops-universe/ops-standards/blob/main/design.md): charcoal-green surfaces with a lime accent (`#D5ED91`) in dark mode, and cream with forest green (`#365C2C`) in light mode. Both modes use the official values. Dark mode deepens the base to near-black (`#0b0e0a`) and adds one cool "signal" teal, used only for telemetry and live status. This avoids the generic purple gradient while staying on-brand. Typography pairs Space Grotesk (display and UI) with JetBrains Mono (code, labels, data), and terminal details carry the infrastructure feel. Every color is a CSS variable in RGB channels, so Tailwind alpha utilities (`bg-accent/10`) work in both themes.

**Motion system.** One easing curve (`[0.16, 1, 0.3, 1]`) is used throughout. Motion comes in layers:

- *Page:* route transitions with a blur and lift.
- *Section:* `Reveal` and `Stagger` play once when scrolled into view.
- *Component:* a hover spotlight, a conic glow border and a 3D tilt on cards; animated counters; the marquee.
- *Micro:* tap scale, a nav underline driven by `layoutId`, the icon morph in the theme toggle, and field errors that expand into view.

The hero canvas pauses when off-screen or when the tab is hidden, and draws a single frame under reduced motion. Magnetic buttons and tilt only turn on for `(hover: hover) and (pointer: fine)`. `<MotionConfig reducedMotion="user">` and a global CSS rule honor `prefers-reduced-motion`.

**Architecture.**

- *Pages* compose *components*, and components read data through *hooks*.
- Network access and parsing live in *lib*. Editorial content lives in *data*.
- `useOrgData` shares one org/repo request across the app.
- Project details are URL-addressable (`/projects?open=ops-cli`), as are filters (`?status=In+review`), so state is linkable and works with the back button.
- The modal renders through a portal and traps focus.
- The README preview uses a small Markdown renderer that never sets raw HTML.

**Honesty by construction.** Following `ops-standards` ("do not use fabricated metrics", "never imply real customers or invented results"):

- Stats are live API values, even when they are zero.
- The telemetry card is labelled *Simulated*.
- Blog posts are labelled *Example article* and claim no author or date.
- The hero terminal shows the real output of `ops-template`'s `npm run demo`.

**Accessibility.**

- Skip link and semantic landmarks.
- One `h1` per page.
- Visible `:focus-visible` rings.
- `aria-pressed` on filters and `aria-expanded` on toggles.
- A labelled form with `aria-invalid` and `aria-describedby`.
- A ⌘K combobox with arrow-key navigation.
- An `sr-only` transcript of the animated terminal.
- Touch targets of 40–44 px or larger.

## Future enhancements

- **MDX blog** with front matter, real authors and dates, an RSS feed, and syntax highlighting (Shiki).
- **Server-side GitHub proxy** (Cloudflare Worker) with a token and edge caching, for live data without rate limits.
- **Shared components**: switch to `@ops-universe/ui` once ops-ui is published and pinned.
- **Testing**: Playwright smoke and axe accessibility tests, plus Lighthouse CI budgets, in the deploy workflow.
- **Analytics**: privacy-friendly and cookieless (e.g. Plausible), gated on a public policy.
- **CMS**: a Git-based CMS (e.g. Decap, Tina) for posts and curated project copy.
- **Discussions**: link GitHub Discussions once enabled, and show recent releases and changelog entries when tags exist.
- **i18n** and a per-project landing-page template generated by `ops-cli`.

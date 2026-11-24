# Ops Universe — organization website

The website for [github.com/ops-universe](https://github.com/ops-universe): open-source AI engineering, forward deployment and responsible automation.

**Engineer responsibly. Deploy confidently.**

> Status: **Developer Preview.** The content reflects the organization as of the GitHub snapshot in `src/data/github-snapshot.json`. Every metric is read from the GitHub API, and every sample (simulated telemetry, example articles) is labelled in the UI.

## Stack

React 18 · TypeScript · Vite 6 · React Router 6 · Tailwind CSS 3 · Framer Motion 11 · Lucide icons · self-hosted Manrope, Instrument Serif and JetBrains Mono (Fontsource)

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
| **Sample**, labelled in the UI | `data/posts.ts` | "Example article" posts (no author or date claimed) |

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
│   ├── og-image.png              # 1200×630, Aurora palette
│   ├── robots.txt   sitemap.xml
├── scripts/
│   ├── fetch-github.mjs          # build-time snapshot (server-side token)
│   └── prerender.mjs             # renders each route → dist/<route>.html + 404.html
└── src/
    ├── main.tsx  App.tsx  routes.tsx  entry-server.tsx  vite-env.d.ts
    ├── layouts/RootLayout.tsx    # skip link, header, page transitions, footer, ⌘K
    ├── pages/                    # Home, Projects, About, Blog, BlogPost, Contact, NotFound
    ├── components/
    │   ├── Header.tsx  Footer.tsx  ThemeToggle.tsx  CommandPalette.tsx
    │   ├── Button.tsx  Reveal.tsx  SectionHeading.tsx  Badges.tsx  Logo.tsx
    │   ├── HeroTerminal.tsx  Marquee.tsx  StatCounter.tsx  ProjectCard.tsx  ProjectModal.tsx
    │   └── motion/                   # IridescentOrb, OrbitCards, ScrollStatement, GlassCubes,
    │                                 # IsometricStack, HorizontalGallery, PhysicsDrop
    ├── hooks/                    # useTheme (mode + palette), useOrgData, useAsync, useDocumentMeta,
    │                             # useMagnetic, useCountUp, useMediaQuery, useCanvasLoop
    ├── lib/                      # github, projects, markdown (safe renderer), format, site, cn
    ├── data/                     # projects, content, posts, github-snapshot.json
    └── styles/globals.css        # palette tokens (3 palettes × light/dark), components, prose, reduced motion
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

**Visual direction.** The look takes its cues from six reference shots: the iridescent AI landing page (palette and hero), Opera's scroll story (huge statement type, crosshair marks, horizontal poster scroll), a Web3 hero (glassy 3D cubes with neon edges), an isometric security illustration (line-art exploded stack), Dezmo (glass cards orbiting a centre, pill navigation, rotating badge) and Tastimi (playful objects that fall and pile up).

**Themes.** Two independent choices, both saved in `localStorage` and applied before first paint:

| Palette | Light | Dark |
|---|---|---|
| **Aurora** (default) | Lavender `#F4F2FD`, deep indigo `#1F1D5A`, violet `#7454F0` | Night indigo `#09081A`, lavender text, violet `#AC92FF` |
| **Graphite** | Monochrome line-art | Near-black, white accents |
| **Forest** | Original ops-standards cream `#F6F4E9` / forest `#365C2C` | Charcoal-green / lime `#D5ED91` |

Mode is Light, Dark or Auto (follows the system). Every colour is a CSS variable in RGB channels (`--bg`, `--ink`, `--accent`, `--primary`, `--glow-1..3` …), so Tailwind alpha utilities work in all six combinations, and canvas drawings re-read their colours when the theme changes. Typography pairs Manrope (UI and display) with Instrument Serif italic for accent words and JetBrains Mono for labels and data.

**Header.** A floating glass card: it drops in on load, narrows and shortens once the page scrolls, slides away while you scroll down and returns when you scroll up. A pill nav has a sliding hover highlight and active indicator; the card's bottom edge is the reading-progress bar. On mobile the same card expands into the menu.

**Motion system.** One easing curve (`[0.16, 1, 0.3, 1]`) throughout.

| Piece | Where | What it does |
|---|---|---|
| `IridescentOrb` | Home hero | Canvas particle sphere that breathes and follows the pointer, over a glassy morphing core |
| `OrbitCards` + `SpinningBadge` | Home hero | Glass cards (allow / review / deny …) orbiting on a tilted ring; hover pauses |
| `ScrollStatement` | Home | Pinned statement; words light up with scroll inside crosshairs and expanding rings |
| `IsometricStack` | Home · What we build | Line-art isometric layers for the four foundation repos, pulling apart on scroll |
| `GlassCubes` | Home · Principles | CSS 3D glass cubes with neon edges, floating and leaning toward the pointer |
| `HorizontalGallery` | Home · Ecosystem | Pinned horizontal scroll of every project card (swipeable row on mobile) |
| `PhysicsDrop` | Home · Call to action | Spheres and labelled chips drop, bounce and pile; push them with the cursor, click to pop |

Also: route transitions, `Reveal` / `Stagger` on scroll, hover spotlight and conic glow borders on cards, magnetic buttons, animated counters and the marquee.

**Performance and accessibility of motion.** Canvas and physics loops run only while on screen and the tab is visible, and the physics loop sleeps once the pile settles. Magnetic and tilt effects only turn on for `(hover: hover) and (pointer: fine)`. Under `prefers-reduced-motion`, the orb draws one frame, the orbit stops, the statement and gallery render without pinning, and the physics pile is computed up front and shown at rest. `<MotionConfig reducedMotion="user">` and a global CSS rule cover everything else. Prerendered HTML shows the statement text in full, and a `<noscript>` rule reveals elements that would otherwise wait for a scroll animation.

**Architecture.**

- *Pages* compose *components*, and components read data through *hooks*.
- Network access and parsing live in *lib*. Editorial content lives in *data*.
- `useOrgData` shares one org/repo request across the app.
- Project details are URL-addressable (`/projects?open=ops-cli`), as are filters (`?status=In+review`), so state is linkable and works with the back button.
- The modal renders through a portal and traps focus.
- The README preview uses a small Markdown renderer that never sets raw HTML.

**Honesty by construction.** Following `ops-standards` ("do not use fabricated metrics", "never imply real customers or invented results"):

- Stats are live API values, even when they are zero.
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

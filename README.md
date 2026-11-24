# Ops Universe website

Official ecosystem directory, Developer Preview. React + Vite with build-time prerendering. Node.js 22+.

```sh
npm install
npm run dev
npm run build
npm test
```

The production build writes index.html, projects/index.html, standards/index.html, community/index.html, 404.html, sitemap.xml and robots.txt. Use VITE_SITE_URL for a verified HTTPS root-domain URL (default https://ops-universe.github.io/). GitHub Pages must be set to GitHub Actions; deployment is only on main after verification. Website links and project states are curated, not live GitHub stats. No DNS changes. Website uses local components until ops-ui packaging is verified. Lockfile and browser accessibility verification pending.

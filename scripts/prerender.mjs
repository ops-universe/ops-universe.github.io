#!/usr/bin/env node
// Build-time prerendering. Renders every public route with React on the server
// (dist-ssr/entry-server.js) and writes it into the client build:
//   /            → dist/index.html
//   /projects    → dist/projects.html        (GitHub Pages serves /projects from it with HTTP 200)
//   /blog/<slug> → dist/blog/<slug>.html
//   unknown      → dist/404.html             (not-found page; the app still routes client-side)
// Each file gets that page's <title>, description, robots, canonical and Open Graph tags.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const { render, prerenderPaths } = await import(pathToFileURL(root('dist-ssr/entry-server.js')).href);
const template = await readFile(root('dist/index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: template is missing ${pattern}`);
  return html.replace(pattern, replacement);
}

function page(appHtml, meta) {
  let html = template;
  if (meta) {
    const t = esc(meta.title);
    const d = esc(meta.description);
    const u = esc(meta.url);
    html = setTag(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
    html = setTag(html, /<meta name="description" content="[^"]*"/, `<meta name="description" content="${d}"`);
    html = setTag(html, /<meta name="robots" content="[^"]*"/, `<meta name="robots" content="${meta.robots}"`);
    html = setTag(html, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${u}"`);
    html = setTag(html, /<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${meta.type}"`);
    html = setTag(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${t}"`);
    html = setTag(html, /<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${d}"`);
    html = setTag(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${u}"`);
    html = setTag(html, /<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${t}"`);
    html = setTag(html, /<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${d}"`);
  }
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: template is missing <div id="root"></div>');
  return html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`);
}

const outputs = [...prerenderPaths.map((p) => [p, p === '/' ? 'index.html' : `${p.slice(1)}.html`]), ['/404', '404.html']];

for (const [path, file] of outputs) {
  const { html, meta } = await render(path);
  const out = root(`dist/${file}`);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, page(html, meta));
  console.log(`prerendered ${path.padEnd(42)} → dist/${file}  (${meta?.title ?? 'no meta'})`);
}

await rm(root('dist-ssr'), { recursive: true, force: true });

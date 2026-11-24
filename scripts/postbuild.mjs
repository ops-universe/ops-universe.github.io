#!/usr/bin/env node
// GitHub Pages serves 404.html for unknown paths. Copying the SPA shell there lets
// deep links like /projects or /blog/<slug> load the app, which then routes them.
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = (p) => fileURLToPath(new URL(`../dist/${p}`, import.meta.url));
await copyFile(dist('index.html'), dist('404.html'));
console.log('Copied dist/index.html → dist/404.html (SPA fallback)');

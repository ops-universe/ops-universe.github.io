#!/usr/bin/env node
// Writes src/data/github-snapshot.json: a build-time copy of public GitHub data the
// site falls back to when the live API is rate limited or offline.
// GITHUB_TOKEN (optional) is read here, in Node, and never reaches the client bundle.
// Only whitelisted public fields are kept, so nothing private is written to disk.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ORG = process.env.GITHUB_ORG || 'ops-universe';
const API = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN;
const out = fileURLToPath(new URL('../src/data/github-snapshot.json', import.meta.url));

async function gh(path, accept = 'application/vnd.github+json') {
  const res = await fetch(`${API}${path}`, {
    headers: {
      Accept: accept,
      'User-Agent': 'ops-universe-website-snapshot',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return accept.includes('raw') ? res.text() : res.json();
}

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj?.[k] ?? null]));

const ORG_KEYS = ['login', 'name', 'description', 'avatar_url', 'html_url', 'blog', 'public_repos', 'followers', 'created_at', 'updated_at'];
const REPO_KEYS = [
  'name', 'full_name', 'description', 'html_url', 'homepage', 'language', 'topics',
  'stargazers_count', 'forks_count', 'open_issues_count', 'watchers_count', 'default_branch',
  'archived', 'fork', 'is_template', 'has_discussions', 'created_at', 'updated_at', 'pushed_at',
];

const org = pick(await gh(`/orgs/${ORG}`), ORG_KEYS);
const rawRepos = (await gh(`/orgs/${ORG}/repos?per_page=100&type=public&sort=pushed`)) ?? [];
const repos = [];
for (const r of rawRepos) {
  const repo = pick(r, REPO_KEYS);
  repo.license = r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null;
  repo.readme = await gh(`/repos/${ORG}/${r.name}/readme`, 'application/vnd.github.raw');
  repos.push(repo);
}

const snapshot = { fetchedAt: new Date().toISOString(), org, repos };
await writeFile(out, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${repos.length} repositories for ${ORG} → ${out}`);

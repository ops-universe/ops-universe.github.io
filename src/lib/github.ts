/**
 * GitHub REST API client for public organization data.
 *
 * - No token is ever read in the browser. To raise rate limits, either run
 *   `npm run snapshot` (Node, server-side GITHUB_TOKEN) or set VITE_GITHUB_API_BASE
 *   to a proxy you control that attaches a token server-side.
 * - Responses are memoized in-memory and cached in sessionStorage for 10 minutes.
 * - Every loader falls back to the build-time snapshot, and results carry a `source`
 *   flag so the UI can show whether data is live or from the snapshot.
 */
import snapshotJson from '@/data/github-snapshot.json';

export const ORG = 'ops-universe';
const API_BASE = (import.meta.env.VITE_GITHUB_API_BASE || 'https://api.github.com').replace(/\/$/, '');
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_PREFIX = 'ou:gh:';

/* ---------- Types ---------------------------------------------------------- */

export interface GitHubOrg {
  login: string;
  name: string | null;
  description: string | null;
  avatar_url: string;
  html_url: string;
  blog: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  is_template: boolean;
  has_discussions: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: string | null;
  /** Raw README markdown. Present in the snapshot; fetched lazily when live. */
  readme?: string | null;
}

/** Shape of a repository as the REST API returns it (only the fields we read). */
interface ApiRepo extends Omit<GitHubRepo, 'license' | 'readme'> {
  license: { spdx_id: string | null } | null;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export type DataSource = 'live' | 'snapshot';

export interface OrgData {
  org: GitHubOrg;
  repos: GitHubRepo[];
  source: DataSource;
  fetchedAt: string;
  error?: string;
}

interface Snapshot {
  fetchedAt: string;
  org: GitHubOrg;
  repos: GitHubRepo[];
}

export const snapshot = snapshotJson as unknown as Snapshot;

/* ---------- Errors --------------------------------------------------------- */

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly rateLimited = false,
    readonly resetAt?: Date,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export function describeError(err: unknown): string {
  if (err instanceof GitHubError) {
    if (err.rateLimited) {
      const when = err.resetAt ? ` until ${err.resetAt.toLocaleTimeString()}` : '';
      return `GitHub API rate limit reached${when}. Showing the build-time snapshot.`;
    }
    return `GitHub API returned ${err.status}. Showing the build-time snapshot.`;
  }
  return 'Could not reach the GitHub API. Showing the build-time snapshot.';
}

/* ---------- Cache ---------------------------------------------------------- */

const memory = new Map<string, Promise<unknown>>();

function readSession<T>(key: string): T | undefined {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    const { t, v } = JSON.parse(raw) as { t: number; v: T };
    return Date.now() - t < CACHE_TTL_MS ? v : undefined;
  } catch {
    return undefined;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    /* storage full or unavailable — memory cache still applies */
  }
}

async function request<T>(path: string, { raw = false } = {}): Promise<T> {
  const key = `${raw ? 'raw:' : ''}${path}`;
  const cached = readSession<T>(key);
  if (cached !== undefined) return cached;
  const inflight = memory.get(key);
  if (inflight) return inflight as Promise<T>;

  const promise = (async () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        signal: controller.signal,
        headers: {
          Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!res.ok) {
        const remaining = res.headers.get('x-ratelimit-remaining');
        const reset = res.headers.get('x-ratelimit-reset');
        const limited = (res.status === 403 || res.status === 429) && remaining === '0';
        throw new GitHubError(
          `GitHub ${res.status} for ${path}`,
          res.status,
          limited,
          reset ? new Date(Number(reset) * 1000) : undefined,
        );
      }
      const value = (raw ? await res.text() : await res.json()) as T;
      writeSession(key, value);
      return value;
    } finally {
      window.clearTimeout(timer);
    }
  })();

  memory.set(key, promise);
  promise.catch(() => memory.delete(key)); // allow retry after failure
  return promise;
}

/* ---------- Endpoints ------------------------------------------------------ */

const normalizeRepo = (r: ApiRepo): GitHubRepo => ({
  ...r,
  topics: r.topics ?? [],
  license: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null,
});

export function fetchOrg(org = ORG) {
  return request<GitHubOrg>(`/orgs/${org}`);
}

export async function fetchRepos(org = ORG): Promise<GitHubRepo[]> {
  const repos = await request<ApiRepo[]>(`/orgs/${org}/repos?per_page=100&type=public&sort=pushed`);
  return repos.map(normalizeRepo);
}

export async function fetchRepo(name: string, org = ORG): Promise<GitHubRepo> {
  return normalizeRepo(await request<ApiRepo>(`/repos/${org}/${name}`));
}

export async function fetchReadme(name: string, org = ORG): Promise<string | null> {
  try {
    return await request<string>(`/repos/${org}/${name}/readme`, { raw: true });
  } catch (err) {
    if (err instanceof GitHubError && err.status === 404) return null;
    const fallback = snapshot.repos.find((r) => r.name === name)?.readme;
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export async function fetchContributors(name: string, org = ORG): Promise<GitHubContributor[]> {
  try {
    const list = await request<GitHubContributor[] | ''>(`/repos/${org}/${name}/contributors?per_page=30`);
    return Array.isArray(list) ? list.filter((c) => c.type !== 'Bot') : []; // empty repos return 204/""
  } catch {
    return [];
  }
}

/** Unique human contributors across all repos, merged by login. */
export async function fetchOrgContributors(repos: GitHubRepo[]): Promise<GitHubContributor[]> {
  const lists = await Promise.all(repos.map((r) => fetchContributors(r.name)));
  const byLogin = new Map<string, GitHubContributor>();
  for (const c of lists.flat()) {
    const prev = byLogin.get(c.login);
    byLogin.set(c.login, prev ? { ...prev, contributions: prev.contributions + c.contributions } : c);
  }
  return [...byLogin.values()].sort((a, b) => b.contributions - a.contributions);
}

/** Organization + repositories, live when possible, snapshot otherwise. */
let orgDataPromise: Promise<OrgData> | null = null;

export function loadOrgData(): Promise<OrgData> {
  orgDataPromise ??= (async (): Promise<OrgData> => {
    try {
      const [org, repos] = await Promise.all([fetchOrg(), fetchRepos()]);
      const withReadme = repos.map((r) => ({
        ...r,
        readme: snapshot.repos.find((s) => s.name === r.name)?.readme,
      }));
      return { org, repos: withReadme, source: 'live', fetchedAt: new Date().toISOString() };
    } catch (err) {
      return {
        org: snapshot.org,
        repos: snapshot.repos,
        source: 'snapshot',
        fetchedAt: snapshot.fetchedAt,
        error: describeError(err),
      };
    }
  })();
  return orgDataPromise;
}

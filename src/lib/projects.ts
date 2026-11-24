import { projects as curated, type ProjectMeta } from '@/data/projects';
import type { GitHubRepo } from './github';

export interface Project {
  meta: ProjectMeta;
  /** Live (or snapshot) GitHub data. Undefined for planned projects. */
  repo?: GitHubRepo;
}

/** Joins curated metadata with GitHub data. Repos without curated entries are kept too. */
export function mergeProjects(repos: GitHubRepo[]): Project[] {
  const byName = new Map(repos.map((r) => [r.name, r]));
  const list: Project[] = curated.map((meta) => ({ meta, repo: byName.get(meta.name) }));
  for (const repo of repos) {
    if (curated.some((c) => c.name === repo.name)) continue;
    list.push({
      repo,
      meta: {
        name: repo.name,
        hasRepo: true,
        status: 'Foundation',
        category: 'Tooling',
        summary: repo.description ?? 'No description yet.',
        tags: repo.topics,
        stack: repo.language ? [repo.language] : [],
        highlights: [],
        contribute: 'See the repository README and CONTRIBUTING guide.',
        source: 'GitHub repository metadata',
      },
    });
  }
  return list;
}

/** GitHub description and topics win over curated copy once maintainers set them. */
export const projectSummary = (p: Project) => p.repo?.description || p.meta.summary;
export const projectTags = (p: Project) => (p.repo?.topics.length ? p.repo.topics : p.meta.tags);
export const projectLanguage = (p: Project) => p.repo?.language ?? (p.meta.hasRepo ? 'Markdown' : null);

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Markdown: '#8a9a7b',
  CSS: '#663399',
  HTML: '#e34c26',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
};

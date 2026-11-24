/**
 * Curated project metadata.
 *
 * Live GitHub fields (stars, forks, language, dates) come from src/lib/github.ts.
 * The fields below are editorial and are sourced from each repository's README,
 * ROADMAP and open pull requests as of the snapshot date. GitHub descriptions and
 * topics are not set on these repositories yet, so `summary` and `tags` fill that gap.
 */
export type ProjectStatus = 'Foundation' | 'In review' | 'Planned';
export type ProjectCategory = 'Governance' | 'Standards' | 'Starter' | 'UI' | 'Tooling' | 'Website' | 'AI operations';

export interface ProjectMeta {
  name: string;
  /** false for planned projects that have no repository yet */
  hasRepo: boolean;
  status: ProjectStatus;
  category: ProjectCategory;
  summary: string;
  tags: string[];
  stack: string[];
  highlights: string[];
  contribute: string;
  /** Where the summary came from, shown in the detail view. */
  source: string;
  featured?: boolean;
  /** Open pull request carrying the initial implementation, if any. */
  pr?: number;
}

export const projects: ProjectMeta[] = [
  {
    name: 'ops-template',
    hasRepo: true,
    status: 'Foundation',
    category: 'Starter',
    featured: true,
    summary:
      'Reusable project starter with a pure policy example: risk is assigned by trusted configuration, never by the caller, and unknown actions are denied.',
    tags: ['policy', 'threat-model', 'adr', 'ci', 'starter'],
    stack: ['Node.js 22+', 'node:test', 'React + Vite (website starter)', 'GitHub Actions'],
    highlights: [
      'decide(action, policy) returns allow / review / deny from trusted config',
      'ADR 001: caller-supplied risk is ignored to block downgrade attacks',
      'Starter threat model, architecture overview and synthetic case study',
      'Community files, issue forms, CODEOWNERS and CI workflow included',
    ],
    contribute: 'Run `npm ci && npm test && npm run demo`. Negative tests for denied and unknown actions are expected with every policy change.',
    source: 'README.md, ROADMAP.md, docs/architecture on main',
  },
  {
    name: 'ops-standards',
    hasRepo: true,
    status: 'Foundation',
    category: 'Standards',
    featured: true,
    summary:
      'Engineering, design and release standards for every Ops Universe project: least privilege, deterministic mocks, explicit approval and evidence-tied release gates.',
    tags: ['standards', 'release-gates', 'design-system', 'governance'],
    stack: ['Markdown', 'Checklists', 'Prompt contracts'],
    highlights: [
      'Release gates reported as verified / unverified / blocked / not applicable',
      'Developer Preview until evidence supports stronger maturity',
      'Shared design tokens for light and dark themes',
      'Scaffolding acceptance checklist and GitHub setup checklist',
    ],
    contribute: 'Propose changes as focused pull requests. Explain the failure mode a new rule prevents and how it can be verified.',
    source: 'README.md, engineering.md, release.md, design.md on main (v0.2 proposal)',
  },
  {
    name: 'ops-cli',
    hasRepo: true,
    status: 'In review',
    category: 'Tooling',
    featured: true,
    pr: 1,
    summary:
      'Local scaffolding and structural validation. Copies an explicitly selected, reviewed template, rejects symlinks and existing destinations, and makes no remote writes.',
    tags: ['cli', 'scaffolding', 'validation', 'zero-dependency'],
    stack: ['Node.js 22+', 'No runtime dependencies'],
    highlights: [
      '`init` customizes metadata and excludes Git metadata, build output and local secrets',
      '`validate` performs a structural baseline check',
      'No GitHub token or network access; template content is never executed',
      'Roadmap: dry-run manifest, template pinning, provider profiles',
    ],
    contribute: 'Review the open initial-implementation PR. Not published to npm yet.',
    source: 'README.md, ROADMAP.md, docs/architecture.md on PR #1 (feat/initial-implementation)',
  },
  {
    name: 'ops-ui',
    hasRepo: true,
    status: 'In review',
    category: 'UI',
    featured: true,
    pr: 1,
    summary:
      'Reusable React components and design tokens: theme provider with system / light / dark, persisted preference and reduced-motion CSS.',
    tags: ['react', 'design-tokens', 'accessibility', 'components'],
    stack: ['React 18/19 (peer)', 'CSS custom properties'],
    highlights: [
      'Header, Hero, Card, Footer and native button / link controls',
      'Warm cream + forest light palette, charcoal-green + lime dark palette',
      'Roadmap: search dialog, navigation menu, motion utilities, visual regression',
    ],
    contribute: 'Review the open initial-implementation PR. Browser accessibility testing is still pending.',
    source: 'README.md, docs/design-system.md, ROADMAP.md on PR #1 (feat/initial-implementation)',
  },
  {
    name: 'ops-universe.github.io',
    hasRepo: true,
    status: 'In review',
    category: 'Website',
    pr: 1,
    summary:
      'Official ecosystem directory with build-time prerendering, sitemap, robots and GitHub Pages deployment through Actions.',
    tags: ['website', 'prerender', 'github-pages', 'seo'],
    stack: ['React', 'Vite', 'GitHub Pages'],
    highlights: [
      'Prerenders /, /projects, /standards, /community and 404',
      'Project states are curated, not live statistics',
      'Deploys on main only after verification',
    ],
    contribute: 'Review the open initial-implementation PR.',
    source: 'README.md on PR #1 (feat/initial-implementation)',
  },
  {
    name: '.github',
    hasRepo: true,
    status: 'Foundation',
    category: 'Governance',
    summary:
      'Organization profile and default community health files: contributing, security, support, code of conduct, issue forms and PR template.',
    tags: ['community', 'governance', 'security-policy'],
    stack: ['Markdown', 'Issue forms (YAML)'],
    highlights: [
      'Private vulnerability reporting route documented in SECURITY.md',
      'Bug report and feature request issue forms',
      'Funding links via FUNDING.yml',
    ],
    contribute: 'Open issues here for organization-wide questions or proposals.',
    source: 'profile/README.md, CONTRIBUTING.md, SECURITY.md on main',
  },
  {
    name: 'evalOps',
    hasRepo: false,
    status: 'Planned',
    category: 'AI operations',
    summary: 'Continuous AI evaluation and regression testing.',
    tags: ['evaluation', 'regression', 'planned'],
    stack: [],
    highlights: ['Listed as planned in the ecosystem directory. No repository yet.'],
    contribute: 'Share requirements or use cases in an issue on the .github repository.',
    source: 'Project directory data in ops-universe.github.io PR #1',
  },
  {
    name: 'guardOps',
    hasRepo: false,
    status: 'Planned',
    category: 'AI operations',
    summary: 'Governed AI actions and approval policies.',
    tags: ['governance', 'approvals', 'planned'],
    stack: [],
    highlights: ['Listed as planned in the ecosystem directory. No repository yet.'],
    contribute: 'Share requirements or use cases in an issue on the .github repository.',
    source: 'Project directory data in ops-universe.github.io PR #1',
  },
  {
    name: 'deployOps',
    hasRepo: false,
    status: 'Planned',
    category: 'AI operations',
    summary: 'Enterprise AI deployment workbench.',
    tags: ['deployment', 'fde', 'planned'],
    stack: [],
    highlights: ['Listed as planned in the ecosystem directory. No repository yet.'],
    contribute: 'Share requirements or use cases in an issue on the .github repository.',
    source: 'Project directory data in ops-universe.github.io PR #1',
  },
];

export const projectByName = (name: string) => projects.find((p) => p.name === name);

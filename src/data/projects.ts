/**
 * Curated project metadata.
 *
 * Live GitHub fields (stars, forks, language, dates) come from src/lib/github.ts.
 * The fields below are editorial and are sourced from each repository's README,
 * ROADMAP files as of the snapshot date. GitHub descriptions and
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
  /** Canonical project documentation website; publish directory only after Pages checks. */
  website?: string;
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
    status: 'Foundation',
    category: 'Tooling',
    featured: true,
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
    contribute: 'Contribute through focused PRs. Not published to npm yet.',
    source: 'README.md, ROADMAP.md and docs/architecture.md on main',
  },
  {
    name: 'ops-ui',
    hasRepo: true,
    status: 'Foundation',
    category: 'UI',
    featured: true,
    summary:
      'Reusable React components and design tokens: theme provider with system / light / dark, persisted preference and reduced-motion CSS.',
    tags: ['react', 'design-tokens', 'accessibility', 'components'],
    stack: ['React 18/19 (peer)', 'CSS custom properties'],
    highlights: [
      'Header, Hero, Card, Footer and native button / link controls',
      '19 unique project palettes with light and dark semantic tokens',
      'Search dialog, mobile navigation, TypeScript declarations and browser accessibility tests',
    ],
    contribute: 'Contribute focused changes and run unit, type, browser and accessibility checks.',
    source: 'README.md and merged PR #3 on main',
  },
  {
    name: 'ops-universe.github.io',
    hasRepo: true,
    status: 'Foundation',
    category: 'Website',
    summary:
      'This website: the organization home and project directory, with live GitHub data, prerendered routes and GitHub Pages deployment through Actions.',
    tags: ['website', 'prerender', 'github-pages', 'motion'],
    stack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    highlights: [
      'Prerenders every route to static HTML with per-page metadata',
      'Live GitHub API data with a build-time snapshot fallback',
      'Aurora, Graphite and Forest palettes in light and dark',
    ],
    contribute: 'Open an issue or a focused pull request on the repository.',
    source: 'README.md on main',
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
    "name": "evalOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Local-first evaluation engineering for LLM applications, retrieval systems and agents.",
    "tags": [
      "evaluation",
      "regression",
      "quality-gates"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Versioned datasets and deterministic metrics",
      "Suite-compatible regression comparisons and absolute gates",
      "Offline RAG and agent trace evaluation"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "evalOps/README.md on main",
    "website": "https://ops-universe.github.io/evalOps/",
    "featured": true
  },
  {
    "name": "guardOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Local-first deterministic authorization and governance for AI agent tool requests.",
    "tags": [
      "governance",
      "authorization",
      "approval"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Deterministic policy and structured arguments",
      "Allow, deny and simulated review lifecycle",
      "Trusted-local audit persistence and host enforcement"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "guardOps/README.md on main",
    "website": "https://ops-universe.github.io/guardOps/",
    "featured": true
  },
  {
    "name": "ragOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Offline retrieval-augmented generation engineering toolkit for inspecting retrieval, context and citations.",
    "tags": [
      "retrieval",
      "grounding",
      "citations"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Local ingestion, chunking and lexical retrieval",
      "Deterministic offline embedding experiments",
      "Access-filtered context and corpus-relative citations"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "ragOps/README.md on main",
    "website": "https://ops-universe.github.io/ragOps/",
    "featured": true
  },
  {
    "name": "traceOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Local-first AI observability toolkit for tracing, metrics, storage and diagnostics.",
    "tags": [
      "observability",
      "tracing",
      "diagnostics"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Versioned trace and span contracts",
      "Nested instrumentation and local metrics",
      "Explicit retention and redacted synthetic dashboard"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "traceOps/README.md on main",
    "website": "https://ops-universe.github.io/traceOps/",
    "featured": true
  },
  {
    "name": "mcpOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Offline-first Model Context Protocol inspection, governance and testing toolkit.",
    "tags": [
      "mcp",
      "tools",
      "governance"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Pinned protocol inspection and explicit inventory",
      "Bounded schemas and simulated approvals",
      "Scoped synthetic in-process SDK interoperability"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "mcpOps/README.md on main",
    "website": "https://ops-universe.github.io/mcpOps/",
    "featured": true
  },
  {
    "name": "workflowOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Local-first governed workflow execution with deterministic DAGs, checkpointing and simulated effects.",
    "tags": [
      "workflows",
      "checkpoints",
      "governance"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Deterministic DAG validation",
      "Bounded retries, checkpoint and conservative resume",
      "Scoped approval and offline simulation"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "workflowOps/README.md on main",
    "website": "https://ops-universe.github.io/workflowOps/",
    "featured": true
  },
  {
    "name": "dataOps",
    "hasRepo": true,
    "status": "Foundation",
    "category": "AI operations",
    "summary": "Local read-only dataset profiling, quality, governance and regression analysis.",
    "tags": [
      "data-quality",
      "profiling",
      "regression"
    ],
    "stack": [
      "Node.js 22+",
      "React + Vite (dashboard)"
    ],
    "highlights": [
      "Bounded CSV, JSON and JSONL ingestion",
      "Deterministic quality contracts and profiling",
      "Split overlap, fingerprints and regression comparison"
    ],
    "contribute": "Read the source documentation and threat model; submit focused changes with synthetic evidence. Public product release remains deferred.",
    "source": "dataOps/README.md on main",
    "website": "https://ops-universe.github.io/dataOps/",
    "featured": true
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

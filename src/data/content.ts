import { Boxes, FileCheck2, GitPullRequestArrow, KeyRound, Layers, LockKeyhole, Scale, ShieldCheck, TerminalSquare, Waypoints, type LucideIcon } from 'lucide-react';

export interface Pillar {
  icon: LucideIcon;
  title: string;
  body: string;
  repo: string;
}

/** "What we build" — each pillar maps to a real repository. */
export const pillars: Pillar[] = [
  {
    icon: Scale,
    title: 'Engineering standards',
    body: 'Contracts for least privilege, bounded retries, redacted logs and explicit approval — plus release gates that no aggregate score can override.',
    repo: 'ops-standards',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted policy decisions',
    body: 'Risk comes from trusted configuration, not the caller. Unknown and inherited actions are denied by default and covered by negative tests.',
    repo: 'ops-template',
  },
  {
    icon: TerminalSquare,
    title: 'Safe local scaffolding',
    body: 'A zero-dependency CLI that copies only a reviewed template, filters secrets and build output, and performs no remote writes.',
    repo: 'ops-cli',
  },
  {
    icon: Layers,
    title: 'Accessible UI foundations',
    body: 'Shared React components and design tokens with system / light / dark themes, persisted preference and reduced-motion support.',
    repo: 'ops-ui',
  },
];

export interface Principle {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** The four principles named in the public organization profile. */
export const principles: Principle[] = [
  { icon: Boxes, title: 'Vendor independence', body: 'Provider adapters only when implemented and tested. No lock-in by default.' },
  { icon: KeyRound, title: 'Explicit authorization', body: 'Sensitive actions require explicit approval. Policy decisions are separate from model suggestions.' },
  { icon: FileCheck2, title: 'Reproducible evidence', body: 'Deterministic mocks, golden datasets and release evidence tied to a commit SHA.' },
  { icon: LockKeyhole, title: 'Secure defaults', body: 'Deny unknown actions, keep secrets out of browsers and logs, and document rollback.' },
];

/** Engineering practices quoted from ops-standards/engineering.md and release.md. */
export const practices: string[] = [
  'Select the smallest viable stack and commit lockfiles.',
  'Validate typed inputs and model outputs.',
  'Test denied actions, failures and recovery — not just happy paths.',
  'Document architecture, ADRs, threat model, runbooks and rollback.',
  'Never imply real customers or invented results.',
  'Report each release gate as verified, unverified, blocked or not applicable.',
];

export interface Milestone {
  label: string;
  title: string;
  body: string;
  state: 'done' | 'active' | 'next';
}

/** Timeline from GitHub history and the repositories' ROADMAP files. */
export const timeline: Milestone[] = [
  {
    label: 'Nov 2026',
    title: 'Organization founded',
    body: 'ops-universe created on GitHub with a public profile and community health files.',
    state: 'done',
  },
  {
    label: 'Foundation',
    title: 'Standards and starter',
    body: 'ops-standards v0.2 proposal and ops-template with a deterministic policy demo, tests and threat model.',
    state: 'done',
  },
  {
    label: 'In review',
    title: 'CLI, UI kit and website',
    body: 'Initial implementations of ops-cli, ops-ui and ops-universe.github.io are open as pull requests.',
    state: 'active',
  },
  {
    label: 'Next',
    title: 'Hardening and publishing',
    body: 'Committed lockfiles, browser and accessibility tests, Pages deployment, template pinning and dry-run manifests.',
    state: 'next',
  },
  {
    label: 'Planned',
    title: 'AI operations projects',
    body: 'evalOps (evaluation), guardOps (governed actions) and deployOps (deployment workbench).',
    state: 'next',
  },
];

/** Focus areas shown in the marquee — every term appears in the repositories. */
export const focusAreas: string[] = [
  'AI engineering',
  'Forward deployment',
  'Responsible automation',
  'Trusted policy',
  'Threat modeling',
  'Release gates',
  'ADRs',
  'Deterministic mocks',
  'Least privilege',
  'Human approval',
  'GitHub Actions',
  'React + TypeScript',
  'Node.js 22',
  'Design tokens',
  'Accessibility',
  'Reduced motion',
];

export const contributeSteps: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Waypoints,
    title: 'Describe the problem',
    body: 'Open an issue with the problem and acceptance criteria. Use the bug report or feature request forms.',
  },
  {
    icon: GitPullRequestArrow,
    title: 'Send a focused PR',
    body: 'One focused branch with tests. Include security implications and a rollback plan.',
  },
  {
    icon: ShieldCheck,
    title: 'Keep it clean',
    body: 'Never submit secrets or proprietary customer data. Maintainers approve merges.',
  },
];

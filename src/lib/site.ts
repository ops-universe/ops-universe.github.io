/** Site-wide configuration and verified links. Everything here is sourced from the
 *  public ops-universe GitHub organization (profile README, FUNDING.yml, community files). */
export const site = {
  name: 'Ops Universe',
  shortName: 'ops-universe',
  tagline: 'Engineer responsibly. Deploy confidently.',
  description:
    'Open-source AI engineering, forward deployment and responsible automation — built on vendor independence, explicit authorization, reproducible evidence and secure defaults.',
  url: (import.meta.env.VITE_SITE_URL || 'https://ops-universe.github.io').replace(/\/$/, ''),
  maturity: 'Developer Preview',
  links: {
    github: 'https://github.com/ops-universe',
    repos: 'https://github.com/orgs/ops-universe/repositories',
    newIssue: 'https://github.com/ops-universe/.github/issues/new/choose',
    issues: 'https://github.com/ops-universe/.github/issues',
    contributing: 'https://github.com/ops-universe/.github/blob/main/CONTRIBUTING.md',
    codeOfConduct: 'https://github.com/ops-universe/.github/blob/main/CODE_OF_CONDUCT.md',
    security: 'https://github.com/ops-universe/.github/blob/main/SECURITY.md',
    support: 'https://github.com/ops-universe/.github/blob/main/SUPPORT.md',
    standards: 'https://github.com/ops-universe/ops-standards',
    sponsor: 'https://github.com/sponsors/AnkitParekh007',
    coffee: 'https://buymeacoffee.com/ankitparekh',
    maintainer: 'https://github.com/AnkitParekh007',
  },
} as const;

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Get involved' },
] as const;

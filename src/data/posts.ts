/**
 * Example articles.
 *
 * These are SAMPLE posts written for this website to show the blog layout. They
 * explain ideas found in the ops-universe repositories, but they are not published
 * articles: they carry no author or publication date, and the UI labels them
 * "Example". Replace them with real posts (or MDX) before launch.
 */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'callout'; text: string };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  /** Repository the article draws on. */
  basedOn: string;
  sections: Section[];
}

export const posts: Post[] = [
  {
    slug: 'trusted-risk-classification',
    title: 'Why risk must come from trusted configuration',
    excerpt:
      'If the caller can label its own action as low risk, your approval flow is decoration. A walk through the policy pattern in ops-template.',
    tags: ['policy', 'security', 'adr'],
    basedOn: 'ops-template',
    sections: [
      {
        id: 'the-problem',
        heading: 'The problem with caller-supplied risk',
        blocks: [
          {
            type: 'p',
            text: 'A common first draft of an approval gateway accepts a payload like { name: "delete", risk: "low" } and routes on the risk field. It is simple, and it moves the trust boundary to the wrong side: any caller that can send a request can also downgrade it.',
          },
          {
            type: 'p',
            text: 'Agents and automations make this worse. A model that proposes an action is, by definition, untrusted input. If it can also describe the risk of that action, it can talk its way past review.',
          },
        ],
      },
      {
        id: 'the-pattern',
        heading: 'The pattern: look up risk, never accept it',
        blocks: [
          {
            type: 'p',
            text: 'The ops-template starter keeps the decision pure and puts risk in configuration that only an authorized source can change. The function below is the entire example.',
          },
          {
            type: 'code',
            lang: 'js',
            code: `export function decide(action, policy) {
  if (!action || typeof action.name !== 'string' || !policy
      || typeof policy !== 'object' || Array.isArray(policy)) return 'deny';
  if (!Object.hasOwn(policy, action.name)) return 'deny';
  const risk = policy[action.name];
  return risk === 'low' ? 'allow' : risk === 'high' ? 'review' : 'deny';
}`,
          },
          {
            type: 'list',
            items: [
              'Malformed input or a missing policy is denied.',
              'Object.hasOwn blocks inherited keys such as "toString" or "__proto__".',
              'Unknown actions are denied, not reviewed.',
              'Only "low" is allowed automatically; "high" goes to human review.',
            ],
          },
        ],
      },
      {
        id: 'testing-the-no-path',
        heading: 'Test the "no" path first',
        blocks: [
          {
            type: 'p',
            text: 'Happy-path tests would pass for the insecure version too. The useful tests are the denials: a downgrade attempt, an inherited property name, an unknown action and a missing policy.',
          },
          {
            type: 'code',
            lang: 'sh',
            code: `$ npm run demo
{"name":"read","decision":"allow"}
{"name":"update","decision":"review"}
{"name":"delete","decision":"deny"}`,
          },
          {
            type: 'callout',
            text: 'This is a demonstration, not an execution gateway. Real deployments still need tenant-scoped policy, authentication, policy versioning and auditable approval receipts.',
          },
        ],
      },
    ],
  },
  {
    slug: 'release-gates-over-scores',
    title: 'Release gates beat aggregate scores',
    excerpt:
      'A 94% readiness score can hide one failed gate that matters. How ops-standards reports maturity gate by gate.',
    tags: ['release', 'standards', 'process'],
    basedOn: 'ops-standards',
    sections: [
      {
        id: 'averages-hide-failures',
        heading: 'Averages hide the failure you care about',
        blocks: [
          {
            type: 'p',
            text: 'Readiness dashboards love a single number. But a release with passing CI, a good README and a leaked secret is not 90% ready — it is not ready. Scores let a strong area pay for a fatal one.',
          },
          {
            type: 'callout',
            text: 'From ops-standards/release.md: "No aggregate score overrides a failed gate."',
          },
        ],
      },
      {
        id: 'four-states',
        heading: 'Four states, not a percentage',
        blocks: [
          {
            type: 'p',
            text: 'Each gate is reported as one of four states, and the evidence is tied to a commit SHA so it can be checked again later.',
          },
          {
            type: 'list',
            items: [
              'Verified — evidence exists for this commit.',
              'Unverified — expected to pass, but nobody has shown it.',
              'Blocked — a known problem prevents it.',
              'Not applicable — explicitly ruled out, with a reason.',
            ],
          },
        ],
      },
      {
        id: 'the-mandatory-list',
        heading: 'The mandatory list',
        blocks: [
          {
            type: 'list',
            items: [
              'A runnable vertical slice',
              'Passing required CI and committed lockfiles',
              'An approved, compatible license before open-source release',
              'No exposed secrets',
              'Negative authorization tests',
              'Accurate documentation',
              'Verified deployment where applicable, and a rollback plan',
            ],
          },
          {
            type: 'p',
            text: 'Until every gate is verified, a project stays in Developer Preview. That label is a feature: it tells users exactly how much to trust what they are running.',
          },
        ],
      },
    ],
  },
  {
    slug: 'scaffolding-without-surprises',
    title: 'Scaffolding without surprises',
    excerpt:
      'Project generators run with your permissions. The trust boundaries ops-cli draws so that a template stays a template.',
    tags: ['cli', 'security', 'tooling'],
    basedOn: 'ops-cli',
    sections: [
      {
        id: 'generators-are-code-paths',
        heading: 'Generators are privileged code paths',
        blocks: [
          {
            type: 'p',
            text: 'A scaffolder reads a template, writes files and often runs install hooks. If the template is wrong or hostile, you find out after it has already touched your disk or your GitHub account.',
          },
        ],
      },
      {
        id: 'the-boundaries',
        heading: 'The boundaries',
        blocks: [
          {
            type: 'list',
            items: [
              'The template is an explicit, local, reviewed checkout — never fetched implicitly.',
              'Template content is copied, not executed.',
              'Symlinks and existing destinations are rejected.',
              'Git metadata, dependency and build directories and local secrets are excluded.',
              'No GitHub token, no network access and no remote writes.',
            ],
          },
          {
            type: 'code',
            lang: 'sh',
            code: `node src/cli.mjs init evalOps --template ../ops-template --dest ../evalOps
node src/cli.mjs validate ../evalOps`,
          },
        ],
      },
      {
        id: 'say-what-it-does-not-do',
        heading: 'Say what it does not do',
        blocks: [
          {
            type: 'p',
            text: 'The ops-cli README is explicit that validation is a structural baseline, not a security or release certification. Naming those limits keeps a green check from being mistaken for an audit.',
          },
          {
            type: 'callout',
            text: 'ops-cli is in review as an open pull request and is not published to npm.',
          },
        ],
      },
    ],
  },
  {
    slug: 'synthetic-case-studies',
    title: 'Honest case studies with synthetic data',
    excerpt:
      'How to show forward-deployed engineering work without leaking customer data or inventing results.',
    tags: ['fde', 'documentation', 'ethics'],
    basedOn: 'ops-standards',
    sections: [
      {
        id: 'the-temptation',
        heading: 'The temptation',
        blocks: [
          {
            type: 'p',
            text: 'Case studies sell. The fastest way to write one is to borrow a real customer story or round a benchmark up. Both are off the table in ops-standards.',
          },
        ],
      },
      {
        id: 'the-structure',
        heading: 'A structure that stays honest',
        blocks: [
          {
            type: 'p',
            text: 'A simulated engagement still follows the real arc, end to end, with synthetic data at every step:',
          },
          {
            type: 'list',
            items: [
              'Discovery and constraints',
              'Acceptance criteria and non-goals',
              'Integration and data validation',
              'Deployment, monitoring and rollback',
              'Real test evidence and simulated feedback',
            ],
          },
          {
            type: 'callout',
            text: 'Record evaluation methods, limitations and actual results. Never imply real customers or invented results.',
          },
        ],
      },
    ],
  },
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export function postText(post: Post): string {
  return post.sections
    .flatMap((s) => [
      s.heading,
      ...s.blocks.map((b) => (b.type === 'list' ? b.items.join(' ') : b.type === 'code' ? b.code : b.text)),
    ])
    .join(' ');
}

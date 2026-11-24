// Generated from ops-ui commit b0be9d8b5112ebfc716490a2aa607c6d31380399; sync on reviewed updates.
type Accent = {light:string;dark:string};
export const projectAccents: Record<string, Accent> & {universe: Accent} = {
  "universe": {
    "light": "#4338a0",
    "dark": "#b7b5ff"
  },
  "repoops": {
    "light": "#365c2c",
    "dark": "#d5ed91"
  },
  "jobsops": {
    "light": "#7138a8",
    "dark": "#d8b4fe"
  },
  "dailytoolsops": {
    "light": "#a04412",
    "dark": "#ffba78"
  },
  "evalops": {
    "light": "#2055ad",
    "dark": "#8dbbff"
  },
  "guardops": {
    "light": "#a82d49",
    "dark": "#ffa0b4"
  },
  "deployops": {
    "light": "#087365",
    "dark": "#70e7d0"
  },
  "dataops": {
    "light": "#805700",
    "dark": "#f7cf64"
  },
  "integrationops": {
    "light": "#087087",
    "dark": "#77d9ef"
  },
  "mcpops": {
    "light": "#8034a0",
    "dark": "#e8adff"
  },
  "workflowops": {
    "light": "#4b6d12",
    "dark": "#b9e66c"
  },
  "ragops": {
    "light": "#236c52",
    "dark": "#82e2b4"
  },
  "traceops": {
    "light": "#385e78",
    "dark": "#9dd3f5"
  },
  "documentops": {
    "light": "#a34f27",
    "dark": "#f5b08b"
  },
  "harnessops": {
    "light": "#53546b",
    "dark": "#c2c3e1"
  },
  "ops-template": {
    "light": "#425b85",
    "dark": "#a8c5f4"
  },
  "ops-ui": {
    "light": "#98386e",
    "dark": "#ffa8d8"
  },
  "ops-cli": {
    "light": "#35695e",
    "dark": "#9de2cd"
  },
  "ops-standards": {
    "light": "#775538",
    "dark": "#e5c29b"
  }
};
export function projectAccent(name:string): Accent {
  const key = name.toLowerCase();
  return (Object.hasOwn(projectAccents, key) ? projectAccents[key] : undefined) ?? projectAccents.universe;
}

import { Fragment, type ReactNode } from 'react';

/**
 * Minimal, safe Markdown → React renderer for README previews.
 * Supports headings, paragraphs, lists, fenced code, tables (as text), inline
 * code, bold, italics and links. It never uses dangerouslySetInnerHTML, so
 * README content cannot inject markup or scripts.
 */
function inline(text: string, base: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<code key={k++}>{m[1].slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={k++} className="font-semibold text-ink">{m[2].slice(2, -2)}</strong>);
    else if (m[3]) {
      const raw = m[5] ?? '';
      const safe = /^(https?:|mailto:)/i.test(raw) ? raw : /^[a-z]+:/i.test(raw) ? null : `${base}/${raw.replace(/^\.?\//, '')}`;
      out.push(
        safe ? (
          <a key={k++} href={safe} target="_blank" rel="noreferrer noopener" className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
            {m[4]}
          </a>
        ) : (
          <span key={k++}>{m[4]}</span>
        ),
      );
    } else if (m[6]) out.push(<em key={k++}>{m[6].slice(1, -1)}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, baseUrl }: { source: string; baseUrl: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (line.startsWith('```')) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) body.push(lines[i++] ?? '');
      i++;
      blocks.push(
        <pre key={key++} className="my-4 overflow-x-auto rounded-xl border border-line bg-bg/80 p-4 text-[12.5px] leading-relaxed text-ink/90">
          <code>{body.join('\n')}</code>
        </pre>,
      );
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1]!.length;
      const cls = level === 1 ? 'text-xl font-semibold mt-2' : 'text-base font-semibold mt-6';
      blocks.push(
        <p key={key++} className={`${cls} text-ink`} role="heading" aria-level={Math.min(level + 2, 6)}>
          {inline(h[2]!, baseUrl)}
        </p>,
      );
      i++;
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i] ?? '')) items.push((lines[i++] ?? '').replace(/^\s*([-*]|\d+\.)\s+(\[[ x]\]\s+)?/, ''));
      blocks.push(
        <ul key={key++}>
          {items.map((it, j) => (
            <li key={j}>{inline(it, baseUrl)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (!line.trim()) {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? '').trim() && !/^(#{1,6}\s|```|\s*([-*]|\d+\.)\s)/.test(lines[i] ?? '')) para.push(lines[i++] ?? '');
    blocks.push(<p key={key++}>{inline(para.join(' '), baseUrl)}</p>);
  }
  return <Fragment>{blocks}</Fragment>;
}

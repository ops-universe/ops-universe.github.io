import { MotionConfig } from 'framer-motion';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import { posts } from '@/data/posts';
import { takeSsrMeta, type ResolvedMeta } from '@/hooks/useDocumentMeta';
import { ThemeProvider } from '@/hooks/useTheme';
import { basename, routerFuture, routes } from '@/routes';

/** Every public route, prerendered to its own HTML file at build time. */
export const prerenderPaths = ['/', '/projects', '/about', '/blog', ...posts.map((p) => `/blog/${p.slug}`), '/contact'];

const handler = createStaticHandler(routes, { basename, future: routerFuture });

/** Renders one path to HTML plus the page's <head> metadata. Used only by scripts/prerender.mjs. */
export async function render(path: string): Promise<{ html: string; meta: ResolvedMeta | null }> {
  const prefix = basename === '/' ? '' : basename;
  const context = await handler.query(new Request(`https://prerender.local${prefix}${path}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context, { future: routerFuture });
  const html = renderToString(
    <StrictMode>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">
          <StaticRouterProvider router={router} context={context} hydrate={false} />
        </MotionConfig>
      </ThemeProvider>
    </StrictMode>,
  );
  return { html, meta: takeSsrMeta() };
}

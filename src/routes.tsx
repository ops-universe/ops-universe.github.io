import type { RouteObject } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { About } from '@/pages/About';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Contact } from '@/pages/Contact';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Projects } from '@/pages/Projects';

/** Shared by the browser router (App.tsx) and the build-time prerenderer (entry-server.tsx). */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'about', element: <About /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const routerFuture = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
} as const;

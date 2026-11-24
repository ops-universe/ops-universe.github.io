import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { About } from '@/pages/About';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Contact } from '@/pages/Contact';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { Projects } from '@/pages/Projects';

const router = createBrowserRouter(
  [
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
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}

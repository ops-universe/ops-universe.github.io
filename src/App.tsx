import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { basename, routerFuture, routes } from '@/routes';

const router = createBrowserRouter(routes, { basename, future: routerFuture });

export function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}

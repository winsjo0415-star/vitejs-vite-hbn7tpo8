// Router configuration

import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LibraryPage } from './pages/LibraryPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/library',
    Component: LibraryPage,
  },
]);

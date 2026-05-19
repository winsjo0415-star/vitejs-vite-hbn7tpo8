// Main App component with router and theme setup

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';

export default function App() {
  // Initialize dark mode on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const theme = stored || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  );
}

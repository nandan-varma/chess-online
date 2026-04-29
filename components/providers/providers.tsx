'use client';

import Navbar from '@/components/NavBar';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DndProvider backend={HTML5Backend}>
        <Toaster />
        <Navbar />
        {children}
      </DndProvider>
    </ThemeProvider>
  );
}

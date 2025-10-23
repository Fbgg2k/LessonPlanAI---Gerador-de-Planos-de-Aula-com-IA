import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 bg-background p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

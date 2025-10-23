import { type ReactNode } from 'react';
import { BookCopy } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-primary">
            <BookCopy className="h-8 w-8" />
            <h1 className="font-headline text-3xl font-bold">LessonPlanAI</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Gerador de Planos de Aula com IA
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

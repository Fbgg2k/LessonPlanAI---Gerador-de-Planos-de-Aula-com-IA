import { createClient } from '@/lib/supabase/server';
import { LessonPlanList } from '@/components/plans/LessonPlanList';
import type { LessonPlan } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function PlansPage() {
  const supabase = createClient();

  const { data: lessonPlans, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // Apenas loga o erro no servidor, não impede a renderização.
    // O erro provavelmente se deve à configuração de RLS no Supabase.
    // Verifique o README.md para o script SQL correto.
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">
          Planos de Aula Gerados
        </h1>
        <Button asChild>
          <Link href="/dashboard">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Plano
          </Link>
        </Button>
      </div>
      <LessonPlanList lessonPlans={(lessonPlans as LessonPlan[]) || []} />
    </div>
  );
}

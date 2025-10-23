import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LessonPlanList } from '@/components/plans/LessonPlanList';
import type { LessonPlan } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default async function PlansPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: lessonPlans, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lesson plans:', error);
    // Optionally, render an error state
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">
          Meus Planos de Aula
        </h1>
        <Button asChild style={{ backgroundColor: '#2ECC71', color: 'white' }}>
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

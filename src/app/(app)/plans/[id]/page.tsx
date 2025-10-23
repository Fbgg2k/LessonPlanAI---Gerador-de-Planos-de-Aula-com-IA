import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { LessonPlanDisplay } from '@/components/plans/LessonPlanDisplay';
import type { LessonPlan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type PageProps = {
  params: { id: string };
};

export default async function PlanDetailPage({ params }: PageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: lessonPlan, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !lessonPlan) {
    console.error('Error fetching lesson plan:', error);
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/plans">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Meus Planos
          </Link>
        </Button>
      </div>
      <LessonPlanDisplay plan={lessonPlan as LessonPlan} />
    </div>
  );
}

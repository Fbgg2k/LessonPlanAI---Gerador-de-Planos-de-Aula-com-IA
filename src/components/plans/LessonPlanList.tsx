import type { LessonPlan } from '@/lib/types';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function LessonPlanList({ lessonPlans }: { lessonPlans: LessonPlan[] }) {
  if (lessonPlans.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-card shadow-sm py-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="font-headline text-2xl font-bold tracking-tight">
            Você ainda não tem planos de aula.
          </h3>
          <p className="text-sm text-muted-foreground">
            Comece a gerar seu primeiro plano de aula agora mesmo.
          </p>
          <Button asChild className="mt-4" style={{ backgroundColor: '#2ECC71', color: 'white' }}>
            <Link href="/dashboard">Gerar Plano de Aula</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessonPlans.map((plan) => (
        <Link href={`/plans/${plan.id}`} key={plan.id}>
          <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl leading-snug">
                {plan.topic}
              </CardTitle>
              <CardDescription>
                Criado{' '}
                {formatDistanceToNow(new Date(plan.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow" />
            <CardFooter className="flex flex-wrap gap-2">
              <Badge variant="secondary">{plan.grade_level}</Badge>
              <Badge variant="secondary">{plan.subject}</Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

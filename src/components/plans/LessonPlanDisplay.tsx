import type { LessonPlan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function Section({ title, content }: { title: string; content: string }) {
  // Simple markdown-like formatting for bold text
  const formattedContent = content
    .replace(/\n/g, '<br />')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  return (
    <div>
      <h2 className="mb-2 font-headline text-2xl font-semibold">{title}</h2>
      <div
        className="prose prose-blue max-w-none text-foreground"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
    </div>
  );
}

export function LessonPlanDisplay({ plan }: { plan: LessonPlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-4xl">{plan.topic}</CardTitle>
        <div className="flex gap-2 pt-2">
          <Badge variant="default">{plan.grade_level}</Badge>
          <Badge variant="default">{plan.subject}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Section
          title="Introdução Lúdica"
          content={plan.lesson_plan_data.playfulIntroduction}
        />
        <Separator />
        <Section
          title="Objetivos de Aprendizagem (BNCC)"
          content={plan.lesson_plan_data.learningObjectives}
        />
        <Separator />
        <Section
          title="Passo a Passo da Atividade"
          content={plan.lesson_plan_data.activityInstructions}
        />
        <Separator />
        <Section
          title="Rubrica de Avaliação"
          content={plan.lesson_plan_data.assessmentRubric}
        />
      </CardContent>
    </Card>
  );
}

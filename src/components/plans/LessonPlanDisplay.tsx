// src/components/plans/LessonPlanDisplay.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LessonPlanData {
  playfulIntroduction: string;
  learningObjectives: string;
  activityInstructions: string;
  assessmentRubric: string;
}

interface LessonPlan {
  id: string;
  created_at: string;
  topic: string;
  grade_level: string;
  subject: string;
  lesson_plan_data: LessonPlanData;
}

function Section({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// In your LessonPlanDisplay component, add this at the top
export function LessonPlanDisplay({ plan }: { plan: LessonPlan }) {
  // Add this debug log
  console.log('LessonPlanDisplay received plan:', {
    id: plan.id,
    topic: plan.topic,
    hasPlayfulIntroduction: !!plan.lesson_plan_data?.playfulIntroduction,
    hasLearningObjectives: !!plan.lesson_plan_data?.learningObjectives,
    hasActivityInstructions: !!plan.lesson_plan_data?.activityInstructions,
    hasAssessmentRubric: !!plan.lesson_plan_data?.assessmentRubric
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-muted/20">
        <CardTitle className="font-heading text-3xl">{plan.topic}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="default">{plan.grade_level}</Badge>
          <Badge variant="default">{plan.subject}</Badge>
          <span className="text-sm text-muted-foreground ml-auto">
            Atualizado em {formatDate(plan.created_at)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Section
          title="Introdução Lúdica"
          content={plan.lesson_plan_data.playfulIntroduction}
        />
        <Separator />
        <Section
          title="Objetivos de Aprendizagem"
          content={plan.lesson_plan_data.learningObjectives}
        />
        <Separator />
        <Section
          title="Instruções das Atividades"
          content={plan.lesson_plan_data.activityInstructions}
        />
        <Separator />
        <Section
          title="Critérios de Avaliação"
          content={plan.lesson_plan_data.assessmentRubric}
        />
      </CardContent>
    </Card>
  );
}
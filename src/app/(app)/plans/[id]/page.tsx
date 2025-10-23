// src/app/(app)/plans/[id]/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { LessonPlanDisplay } from '@/components/plans/LessonPlanDisplay';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState, use } from 'react';

interface LessonInput {
  id: string;
  tema?: string;
  nivel_ensino?: string;
}

interface LessonPlan {
  id: string;
  introducao_ludica?: string;
  objetivo_bncc?: string;
  passo_a_passo?: string;
  rubrica_avaliacao?: string;
  input_id: string;
  updated_at: string;
  created_at: string;
  lesson_inputs?: {
    id: string;
    tema?: string;
    nivel_ensino?: string;
    area_conhecimento?: string;
  };
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Safely unwrap the params
  const { id } = use(params);

  useEffect(() => {
    // Update the fetchPlan function in your [id]/page.tsx
    const fetchPlan = async () => {
      try {
        const supabase = createClient();
        const { id } = params;

        // First, get the lesson plan with related input data in a single query
        const { data: lessonData, error: planError } = await supabase
          .from('lesson_plans')
          .select(`
            *,
            lesson_inputs!lesson_plans_input_id_fkey (
              id,
              tema,
              nivel_ensino,
              area_conhecimento
            )
          `)
          .eq('id', id)
          .single();

        if (planError || !lessonData) {
          throw planError || new Error('Plano não encontrado');
        }

        console.log('Fetched lesson data:', {
          id: lessonData.id,
          has_intro: !!lessonData.introducao_ludica,
          has_objetivo: !!lessonData.objetivo_bncc,
          has_passo: !!lessonData.passo_a_passo,
          has_rubrica: !!lessonData.rubrica_avaliacao,
          has_input: !!lessonData.lesson_inputs
        });

        setPlan(lessonData);
      } catch (err) {
        console.error('Error in PlanDetailPage:', err);
        setError('Erro ao carregar o plano de aula');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]); // Now using the unwrapped id

  if (loading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  if (error || !plan) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500 mb-4">{error || 'Plano não encontrado'}</div>
        <Button asChild variant="outline">
          <Link href="/plans">Voltar para Meus Planos</Link>
        </Button>
      </div>
    );
  }

// Transform the data to match what LessonPlanDisplay expects
const formattedPlan = {
  id: plan.id,
  created_at: plan.updated_at || plan.created_at,
  topic: plan.lesson_inputs?.tema || 'Tópico não especificado',
  grade_level: plan.lesson_inputs?.nivel_ensino || 'Nível não especificado',
  subject: plan.lesson_inputs?.area_conhecimento || 'Tecnologia',
  lesson_plan_data: {
    playfulIntroduction: plan.introducao_ludica || 'Nenhuma introdução disponível',
    learningObjectives: plan.objetivo_bncc || 'Nenhum objetivo de aprendizagem disponível',
    activityInstructions: plan.passo_a_passo || 'Nenhuma instrução de atividade disponível',
    assessmentRubric: plan.rubrica_avaliacao || 'Nenhum critério de avaliação disponível'
  }
};

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/plans" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Meus Planos
          </Link>
        </Button>
      </div>
      <LessonPlanDisplay plan={formattedPlan} />
    </div>
  );
}


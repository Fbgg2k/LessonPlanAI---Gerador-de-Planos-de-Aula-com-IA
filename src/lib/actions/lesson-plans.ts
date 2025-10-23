'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { generateLessonPlan } from '@/ai/flows/generate-lesson-plan';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  gradeLevel: z.string().min(1, 'Nível de ensino é obrigatório.'),
  subject: z.string().min(1, 'Assunto é obrigatório.'),
  topic: z.string().min(3, 'O tópico deve ter pelo menos 3 caracteres.'),
});

type State = {
  message: string | null;
  planId?: string | null;
};

export async function createLessonPlan(prevState: State, formData: FormData): Promise<State> {
  // Parse form data
  const formDataObj = {
    gradeLevel: formData.get('gradeLevel') as string,
    subject: formData.get('subject') as string,
    topic: formData.get('topic') as string,
  };

  // Validate form data
  const validatedFields = formSchema.safeParse(formDataObj);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      message: `Campos inválidos: ${errorMessages}`,
    };
  }

  try {
    const { gradeLevel, subject, topic } = validatedFields.data;

    // Generate lesson plan using AI
    const aiResponse = await generateLessonPlan({ gradeLevel, subject, topic });

    if (!aiResponse?.lessonPlan) {
      return { message: 'A IA não conseguiu gerar o plano de aula.' };
    }

    // Get Supabase client
    const supabase = await createClient();
    
    // First, insert into lesson_inputs to get the input_id
    const { data: inputData, error: inputError } = await supabase
      .from('lesson_inputs')
      .insert({
        tema: topic,
        nivel_ensino: gradeLevel,
        faixa_etaria: gradeLevel, // You might want to adjust this based on grade level
        objetivo_especifico: `Plano de aula sobre ${topic} para ${gradeLevel}`,
        recursos_disponiveis: 'A definir'
      })
      .select('id')
      .single();

    if (inputError) {
      console.error('Error saving lesson input:', inputError);
      return { message: 'Falha ao salvar os dados iniciais do plano de aula.' };
    }

    // Then insert into lesson_plans with the input_id
    const { data: planData, error: planError } = await supabase
      .from('lesson_plans')
      .insert({
        input_id: inputData.id,
        introducao_ludica: aiResponse.lessonPlan.introducao || 'Introdução a ser definida',
        objetivo_bncc: aiResponse.lessonPlan.objetivos || 'Objetivos a serem definidos',
        passo_a_passo: aiResponse.lessonPlan.etapas || 'Etapas a serem definidas',
        rubrica_avaliacao: aiResponse.lessonPlan.avaliacao || 'Critérios de avaliação a serem definidos',
        resumo_geral: aiResponse.lessonPlan.resumo || 'Resumo a ser definido',
        grade_level: gradeLevel
      })
      .select('id')
      .single();

    if (planError) {
      console.error('Error saving lesson plan:', planError);
      return { message: 'Falha ao salvar o plano de aula.' };
    }

    revalidatePath('/plans');
    return { 
      message: 'Plano de aula criado com sucesso!', 
      planId: planData.id 
    };

  } catch (e) {
    console.error('Error creating lesson plan:', e);
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return { message: errorMessage };
  }
}
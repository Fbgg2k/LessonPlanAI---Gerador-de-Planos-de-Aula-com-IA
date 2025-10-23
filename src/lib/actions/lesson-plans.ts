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

export async function createLessonPlan(prevState: State, formData: FormData) : Promise<State> {
  const validatedFields = formSchema.safeParse({
    gradeLevel: formData.get('gradeLevel'),
    subject: formData.get('subject'),
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      message: `Campos inválidos: ${errorMessages}`,
    };
  }

  try {
    const { gradeLevel, subject, topic } = validatedFields.data;

    const aiResponse = await generateLessonPlan({ gradeLevel, subject, topic });

    if (!aiResponse || !aiResponse.lessonPlan) {
      return { message: 'A IA não conseguiu gerar o plano de aula.' };
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert({
        topic: topic,
        grade_level: gradeLevel,
        subject: subject,
        lesson_plan_data: aiResponse.lessonPlan,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return { message: 'Falha ao salvar o plano de aula no banco de dados.' };
    }

    revalidatePath('/plans');
    return { message: 'Plano de aula criado com sucesso!', planId: data.id };
  } catch (e) {
    console.error('Error creating lesson plan:', e);
    const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
    return { message: errorMessage };
  }
}

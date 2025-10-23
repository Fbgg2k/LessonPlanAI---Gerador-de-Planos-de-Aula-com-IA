'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating lesson plans based on user inputs.
 *
 * The flow takes in grade level, subject, and topic as input, and returns a lesson plan
 * that includes a playful introduction, learning objectives aligned with the BNCC,
 * step-by-step activity instructions, and assessment rubrics.
 *
 * - generateLessonPlan - A function that generates a lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the lesson plan generation
const GenerateLessonPlanInputSchema = z.object({
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The topic of the lesson plan.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

// Define the output schema for the lesson plan generation
const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.object({
    playfulIntroduction: z.string().describe('A playful and engaging introduction to the topic.'),
    learningObjectives: z.string().describe('Learning objectives aligned with the BNCC.'),
    activityInstructions: z.string().describe('Step-by-step instructions for the activity.'),
    assessmentRubric: z.string().describe('Criteria for assessing student learning.'),
  }).describe('The generated lesson plan.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

// Define the wrapper function
export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

// Define the prompt for generating the lesson plan
const generateLessonPlanPrompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an AI assistant specialized in creating lesson plans for Brazilian educators.

  Given the grade level, subject, and topic, generate a complete and structured lesson plan. The plan must include the following four sections:

  1.  **Introdução Lúdica:** A creative and engaging introduction to capture students' attention.
  2.  **Objetivos de Aprendizagem (BNCC):** Clearly defined learning objectives aligned with the Brazilian National Common Curricular Base (BNCC). Be specific and reference the corresponding BNCC codes if possible.
  3.  **Passo a Passo da Atividade:** Detailed, step-by-step instructions for carrying out the lesson's main activity.
  4.  **Rubrica de Avaliação:** A clear and concise rubric with criteria to evaluate student learning and performance.

  Use the following inputs to generate the plan:

  - **Nível de Ensino:** {{{gradeLevel}}}
  - **Matéria:** {{{subject}}}
  - **Tema da Aula:** {{{topic}}}

  Please provide a well-formatted and detailed response in Brazilian Portuguese, ensuring all four required sections are present and well-developed.
  `,
});

// Define the flow for generating the lesson plan
const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await generateLessonPlanPrompt(input);
    return output!;
  }
);

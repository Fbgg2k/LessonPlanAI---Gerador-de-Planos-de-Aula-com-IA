import type { GenerateLessonPlanOutput } from '@/ai/flows/generate-lesson-plan';

export type LessonPlan = {
  id: string;
  created_at: string;
  topic: string;
  grade_level: string;
  subject: string;
  lesson_plan_data: GenerateLessonPlanOutput['lessonPlan'];
};

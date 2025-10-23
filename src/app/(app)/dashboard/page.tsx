import { LessonPlanForm } from '@/components/dashboard/LessonPlanForm';

export default function DashboardPage() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-headline text-3xl font-semibold">
          Gerador de Planos de Aula
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para criar um plano de aula personalizado
          com a ajuda da IA.
        </p>
      </div>
      <LessonPlanForm />
    </div>
  );
}

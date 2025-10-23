'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createLessonPlan } from '@/lib/actions/lesson-plans';
import { Wand2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  gradeLevel: z.string().min(1, 'Nível de ensino é obrigatório.'),
  subject: z.string().min(1, 'Matéria é obrigatória.'),
  topic: z.string().min(3, 'O tópico deve ter pelo menos 3 caracteres.'),
});

const initialState = {
  message: null,
  planId: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
    >
      {pending ? (
        'Gerando...'
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" /> Gerar Plano de Aula
        </>
      )}
    </Button>
  );
}

export function LessonPlanForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction] = useFormState(createLessonPlan, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: '',
      subject: '',
      topic: '',
    },
  });

  useEffect(() => {
    if (state?.message && !state.planId) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar plano',
        description: state.message,
      });
    }
    if (state?.planId) {
      toast({
        title: 'Sucesso!',
        description: 'Seu plano de aula foi gerado.',
      });
      router.push(`/plans/${state.planId}`);
    }
  }, [state, toast, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Detalhes da Aula</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Ensino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de ensino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ensino Fundamental I">
                          Ensino Fundamental I
                        </SelectItem>
                        <SelectItem value="Ensino Fundamental II">
                          Ensino Fundamental II
                        </SelectItem>
                        <SelectItem value="Ensino Médio">Ensino Médio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Componente Curricular (Matéria)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a matéria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Português">Português</SelectItem>
                        <SelectItem value="Matemática">Matemática</SelectItem>
                        <SelectItem value="Ciências">Ciências</SelectItem>
                        <SelectItem value="História">História</SelectItem>
                        <SelectItem value="Geografia">Geografia</SelectItem>
                        <SelectItem value="Artes">Artes</SelectItem>
                        <SelectItem value="Educação Física">
                          Educação Física
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema/Assunto da Aula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: O ciclo da água" {...field} />
                  </FormControl>
                  <FormDescription>
                    Seja específico sobre o que você quer ensinar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

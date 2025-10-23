import { LoginForm } from '@/components/auth/LoginForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      {searchParams?.message?.includes('Email not confirmed') && (
         <Alert variant='default'>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Confirme seu e-mail</AlertTitle>
          <AlertDescription>
            Enviamos um link de confirmação para o seu e-mail. Por favor,
            verifique sua caixa de entrada.
          </AlertDescription>
        </Alert>
      )}
      {searchParams?.message && !searchParams?.message?.includes('Email not confirmed') && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erro de Autenticação</AlertTitle>
          <AlertDescription>{searchParams.message}</AlertDescription>
        </Alert>
      )}
      <LoginForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Não tem uma conta?{' '}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}

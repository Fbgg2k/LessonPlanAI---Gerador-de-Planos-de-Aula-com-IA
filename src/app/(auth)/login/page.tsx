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
      {searchParams?.message && (
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

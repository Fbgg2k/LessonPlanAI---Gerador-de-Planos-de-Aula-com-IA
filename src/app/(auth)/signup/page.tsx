import { SignUpForm } from '@/components/auth/SignUpForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="flex flex-col gap-4">
       {searchParams?.message && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erro no Cadastro</AlertTitle>
          <AlertDescription>{searchParams.message}</AlertDescription>
        </Alert>
      )}
      <SignUpForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já tem uma conta?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}

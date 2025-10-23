'use client';
import { signup } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SignUpForm() {
  return (
    <form action={signup} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full">
        Criar conta
      </Button>
    </form>
  );
}

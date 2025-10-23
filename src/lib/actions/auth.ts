'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in a real app you should validate requests
  const data = Object.fromEntries(formData);

  const { error } = await supabase.auth.signInWithPassword(data as any);

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = Object.fromEntries(formData);

  // In a real app you should validate requests
  const { error } = await supabase.auth.signUp(data as any);

  if (error) {
    return redirect(`/signup?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    // This should not happen if .env is set up correctly, but it's a good safeguard.
    return redirect('/signup?message=URL do site não configurada. Contate o suporte.');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Supabase sends a confirmation email to the user.
      // This URL is where the user will be redirected after clicking the confirmation link.
      // For local development, you might want to disable email confirmation in your Supabase project settings.
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/signup?message=${error.message}`);
  }

  // In a real app, you would show a "please check your email" message here.
  // For this project, we'll redirect directly to the dashboard,
  // assuming email confirmation is disabled in Supabase settings for easier testing.
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}


export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

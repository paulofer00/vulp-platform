'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string; // 'student' ou 'company'

  // 1. Criar Usuário no Auth
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Aqui passamos os dados extras para o Gatilho (Trigger) do banco
      data: {
        full_name: fullName,
        role: role, 
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // 2. Redirecionar
  // Se o Supabase exigir confirmação de email, mandamos para uma tela de aviso.
  // Se não, mandamos direto pro login.
  redirect("/login?success=true");
}
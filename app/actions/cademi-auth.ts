"use server";

import { getCademiLoginToken } from "@/lib/cademi";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginToClassroom() {
  // 1. Pegar o usuário logado no Supabase (Segurança)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error("Usuário não logado.");
  }

  // 2. Pedir o link mágico para a Cademi usando o e-mail do aluno
  const magicLink = await getCademiLoginToken(user.email);

  if (!magicLink) {
    // Se der erro (ex: aluno não existe na Cademi ainda), você pode tratar aqui
    console.error("Falha ao gerar token Cademi para:", user.email);
    // Retornamos null para a interface mostrar um erro amigável
    return null; 
  }

  // 3. Se deu certo, retornamos o link
  return magicLink;
}
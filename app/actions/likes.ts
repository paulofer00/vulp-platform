'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleCompanyLike(companyId: string, isLiked: boolean) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado" };

  if (isLiked) {
    // Se já estava curtido, vamos REMOVER (Unlike)
    // O match procura exatamente o par (aluno + empresa) para deletar
    await supabase
      .from("company_likes")
      .delete()
      .match({ student_id: user.id, company_id: companyId });
  } else {
    // Se não estava, vamos ADICIONAR (Like)
    await supabase
      .from("company_likes")
      .insert({ student_id: user.id, company_id: companyId });
  }

  // Atualiza a página para mostrar a mudança
  revalidatePath("/aluno/empresas");
  return { success: true };
}
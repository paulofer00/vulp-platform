import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Tenta inserir TODOS os dados (Nome, Email, Phone, Origin)
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(body)
      .select() // 👈 ISSO É VITAL: Obriga o Supabase a devolver a linha criada!
      .single();

    if (error) {
      // 2. A SUA SACADA GENIAL: Se o e-mail já existe (erro 23505)...
      if (error.code === '23505') {
        // ...nós buscamos o aluno que já estava no banco para pegar o ID dele!
        const { data: existingLead } = await supabaseAdmin
            .from("leads")
            .select("id")
            .eq("email", body.email)
            .single();
            
        if (existingLead) {
             // Devolve o ID antigo para ele poder pagar a mesma!
             return NextResponse.json({ id: existingLead.id });
        }
      }
      throw error;
    }

    // 3. Devolve o ID novo fresquinho para a Landing Page mandar para a InfinitePay
    return NextResponse.json({ id: data.id });

  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
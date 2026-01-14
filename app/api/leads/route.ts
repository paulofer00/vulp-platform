import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Tenta salvar no Supabase
    const { error } = await supabaseAdmin
      .from("leads")
      .insert({ email });

    if (error) {
      // Se der erro de duplicidade (código 23505), finge que deu certo pro usuário não saber
      if (error.code === '23505') {
        return NextResponse.json({ message: "Email já cadastrado!" });
      }
      throw error;
    }

    return NextResponse.json({ message: "Cadastrado com sucesso!" });

  } catch (error) {
    console.error("Erro ao salvar lead:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
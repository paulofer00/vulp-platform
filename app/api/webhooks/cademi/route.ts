import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

// --- CONFIGURAÇÃO: MAPA DE MEDALHAS ---
// Aqui você diz: "Quem terminar o curso com ID tal, ganha a medalha tal"
const COURSE_MEDAL_MAP: Record<string, string> = {
  "123": "mestre-trafego",  // ID do curso na Cademi -> Slug da medalha no Banco
  "456": "copywriter-pro",
  // Adicione outros cursos aqui...
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Recebido da Cademi:", body);

    // Ajuste estes campos conforme o JSON real da Cademi
    // Geralmente vem: { aluno: { email, nome, id }, event: 'course_completed', course: { id } }
    const email = body.email || body.aluno?.email;
    const nome = body.nome || body.aluno?.nome;
    const cademiUserId = body.id_usuario || body.aluno?.id;
    const courseId = body.course_id || body.curso?.id; // O ID do curso que ele terminou
    const eventType = body.event || body.tipo; // Ex: 'conclusao_curso'

    if (!email) {
      return NextResponse.json({ error: "Email não identificado" }, { status: 400 });
    }

    // 1. Achar ou Criar o Aluno
    const { data: existingStudent } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    let studentId = existingStudent?.id;

    if (!studentId) {
      const { data: newStudent, error } = await supabaseAdmin
        .from("students")
        .insert({
          email,
          full_name: nome || "Aluno VULP",
          cademi_id: cademiUserId,
          points: 100, // Ganha 100xp só de entrar
        })
        .select()
        .single();

      if (error) throw error;
      studentId = newStudent.id;
    }

    // 2. Lógica de Gamificação (Dar Medalha)
    // Só processa se for evento de conclusão ou se tivermos um ID de curso
    if (courseId && COURSE_MEDAL_MAP[courseId]) {
      const medalSlug = COURSE_MEDAL_MAP[courseId];

      // A. Achar o ID da medalha no nosso banco
      const { data: medal } = await supabaseAdmin
        .from("medals")
        .select("id, name")
        .eq("slug", medalSlug)
        .single();

      if (medal) {
        // B. Verificar se ele já tem essa medalha (para não dar duplicada)
        const { data: existingMedal } = await supabaseAdmin
          .from("student_medals")
          .select("id")
          .eq("student_id", studentId)
          .eq("medal_id", medal.id)
          .single();

        if (!existingMedal) {
          // C. DAR A MEDALHA! 🏅
          await supabaseAdmin.from("student_medals").insert({
            student_id: studentId,
            medal_id: medal.id
          });

          // D. Dar Pontos Extras (Ex: +500xp por terminar um curso)
          // Como não criamos a função RPC, vamos fazer update simples:
          const { data: currentStudent } = await supabaseAdmin.from("students").select("points").eq("id", studentId).single();
          const newPoints = (currentStudent?.points || 0) + 500;
          
          await supabaseAdmin.from("students").update({ points: newPoints }).eq("id", studentId);

          return NextResponse.json({ message: `Medalha ${medal.name} concedida!` });
        }
      }
    }

    return NextResponse.json({ message: "Dados processados (sem novas medalhas)." });

  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
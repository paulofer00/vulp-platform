import { supabaseAdmin } from "@/lib/supabase";
import { createCademiStudent } from "@/lib/cademi";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

// --- 1. CONFIGURAÇÃO: MAPA DE CURSOS ---
// Aqui você liga a "origin" (do formulário) ao ID do curso na Cademi
const ORIGIN_TO_COURSE_ID: Record<string, string> = {
  "raposa-marketing-lp": "539381", // ✅ Seu ID Configurado
  // "raposa-vendas-lp": "67890", // Futuro
};

export async function POST(request: Request) {
  try {
    // --- SEGURANÇA VIA URL ---
    const { searchParams } = new URL(request.url);
    const secretFromUrl = searchParams.get("secret");
    const mySecret = process.env.INFINITEPAY_WEBHOOK_SECRET;

    if (secretFromUrl !== mySecret) {
      return NextResponse.json({ error: "Acesso negado: Senha incorreta" }, { status: 401 });
    }

    // --- PROCESSAMENTO DO PEDIDO ---
    const body = await request.json();
    console.log("🔔 Webhook InfinitePay Recebido:", body);

    const status = body.status || body.data?.status; 

    if (status !== "paid" && status !== "approved") {
      return NextResponse.json({ message: "Status ignorado (não pago)" });
    }

    const leadId = body.order_nsu || body.metadata?.leadId || body.order_id;

    if (!leadId) {
      console.error("❌ Pagamento sem ID de Lead vinculado.");
      return NextResponse.json({ error: "Lead ID missing" }, { status: 400 });
    }

    // Busca o Lead no Banco
    const { data: lead } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (!lead) {
      console.error("❌ Lead não encontrado no banco:", leadId);
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // --- 2. LÓGICA DE ESCOLHA DO CURSO ---
    console.log(`🦊 Lead Encontrado (${lead.name}) vindo de: ${lead.origin}`);

    // Descobre qual curso liberar baseado na origem
    const courseIdToEnroll = ORIGIN_TO_COURSE_ID[lead.origin];
    
    // Se achou um curso correspondente, coloca na lista. Se não, lista vazia.
    const courseIds = courseIdToEnroll ? [courseIdToEnroll] : [];

    if (!courseIdToEnroll) {
        console.warn("⚠️ Nenhum ID de curso mapeado para esta origem:", lead.origin);
    }

    // --- 3. CRIAÇÃO NA CADEMI COM O CURSO CERTO ---
    const cademiResult = await createCademiStudent({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      courseIds: courseIds 
    });

    if (cademiResult.success) {
      console.log(`✅ Aluno matriculado: ${lead.email}`);
      console.log(`🔑 Senha Gerada: ${cademiResult.password}`); 

      // --- 4. ENVIAR E-MAIL COM A SENHA ---
      if (cademiResult.password) {
          await sendWelcomeEmail(lead.email, lead.name, cademiResult.password);
          console.log(`📧 E-mail de acesso enviado para: ${lead.email}`);
      }

      return NextResponse.json({ message: "Aluno matriculado e notificado!" });
    } else {
      // ESTE ERA O PEDAÇO QUE FALTAVA:
      return NextResponse.json({ error: "Erro ao criar na Cademi" }, { status: 500 });
    }

  } catch (error) {
    console.error("Erro crítico no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
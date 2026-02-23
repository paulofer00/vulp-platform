import { supabaseAdmin } from "@/lib/supabase";
import { createCademiStudent } from "@/lib/cademi";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

// --- 1. CONFIGURAÇÃO: MAPA DE CURSOS ---
const ORIGIN_TO_COURSE_ID: Record<string, string> = {
  "raposa-marketing-lp": "Cursovitalicio", // ID do curso Marketing
  "posicione-se-agora": "posicionese",  // ID do curso Posicione-se
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

    const courseIdToEnroll = ORIGIN_TO_COURSE_ID[lead.origin];
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

    // 👇 AQUI ESTÁ A CORREÇÃO PRINCIPAL 👇
    if (cademiResult.success) {
      console.log(`✅ Aluno matriculado: ${lead.email}`);
      
      // Se a Cademi não mandar a senha (porque o aluno já tinha cadastro), mandamos essa mensagem no lugar:
      const passwordToSend = cademiResult.password || "Você já possui cadastro na VULP! Use a sua senha antiga ou clique em 'Esqueci minha senha' na página de login.";

      // --- 4. ENVIAR E-MAIL (AGORA ENVIA SEMPRE!) ---
      await sendWelcomeEmail(lead.email, lead.name, passwordToSend);
      console.log(`📧 E-mail de acesso enviado para: ${lead.email}`);

      return NextResponse.json({ message: "Aluno matriculado e notificado!" });
    } else {
      console.error("❌ Falha na Cademi:", cademiResult.error);
      return NextResponse.json({ error: "Erro ao criar na Cademi" }, { status: 500 });
    }

  } catch (error) {
    console.error("Erro crítico no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
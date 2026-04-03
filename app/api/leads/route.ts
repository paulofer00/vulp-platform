import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let leadId;

    // --- 1. A PORTA INTELIGENTE (Verifica duplicidade) ---
    const { data: existingLead } = await supabaseAdmin
      .from("leads")
      .select("id, status")
      .eq("email", body.email)
      .single();

    if (existingLead) {
      // O LEAD JÁ EXISTE NO SEU CRM!
      leadId = existingLead.id;
      
      // Atualiza o nome e o telefone (caso ele tenha digitado um diferente agora)
      // Mas MANTÉM o status que ele já tinha (Pendente ou Contatado)
      await supabaseAdmin
        .from("leads")
        .update({ name: body.name, phone: body.phone })
        .eq("id", leadId);
        
      console.log(`🦊 Lead Recorrente identificado! ID: ${leadId}`);
    } else {
      // É UM LEAD TOTALMENTE NOVO! Insere no banco.
      const { data: newLead, error } = await supabaseAdmin
        .from("leads")
        .insert(body)
        .select()
        .single();

      if (error) throw error;
      leadId = newLead.id;
      console.log(`🟢 Novo Lead criado! ID: ${leadId}`);
    }

    // --- 2. COMUNICA COM A API DA INFINITEPAY ---
    const infinitePayload = {
      handle: "upeup",
      redirect_url: "https://vulp.vc/obrigado",
      webhook_url: "https://vulp.vc/api/webhooks/infinitepay?secret=raposa_secret_vulp_1973",
      order_nsu: String(leadId), // Enviamos o ID (seja ele novo ou antigo)
      items: [
        {
          quantity: 1,
          price: 19700, // Preço de R$ 97,00 (9700 cêntimos)
          description: "Curso Posicione-se Agora"
        }
      ]
    };

    const infiniteResponse = await fetch("https://api.infinitepay.io/invoices/public/checkout/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infinitePayload)
    });

    if (!infiniteResponse.ok) {
       console.error("Erro na InfinitePay:", await infiniteResponse.text());
       return NextResponse.json({ error: "Erro ao gerar link de pagamento na InfinitePay" }, { status: 500 });
    }

    // --- 3. RECEBE O LINK DE CHECKOUT ÚNICO ---
    const infiniteData = await infiniteResponse.json();
    
    // Devolve o link pronto para a Landing Page abrir o pop-up
    return NextResponse.json({ checkoutUrl: infiniteData.url });

  } catch (error) {
    console.error("Erro ao processar:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
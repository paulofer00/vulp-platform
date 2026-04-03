import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. SALVA O LEAD NO SUPABASE E PEGA O ID OFICIAL
    let leadId;
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert(body)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Se o e-mail já existir, pega o ID antigo
        const { data: existingLead } = await supabaseAdmin
            .from("leads")
            .select("id")
            .eq("email", body.email)
            .single();
        if (existingLead) {
             leadId = existingLead.id;
        } else {
             throw error;
        }
      } else {
        throw error;
      }
    } else {
      leadId = data.id;
    }

    // 2. COMUNICA COM A API PÚBLICA DA INFINITEPAY
    // Cria o "Envelope" exatamente como a sua tela de documentação manda!
    const infinitePayload = {
      handle: "upeup",
      redirect_url: "https://vulp.vc/obrigado",
      webhook_url: "https://vulp.vc/api/webhooks/infinitepay?secret=raposa_secret_vulp_1973",
      order_nsu: String(leadId),
      items: [
        {
          quantity: 1,
          price: 19700, // Lembre-se, 9700 cêntimos = R$ 97,00
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

    // 3. RECEBE O LINK DE CHECKOUT ÚNICO GERADO POR ELES
    const infiniteData = await infiniteResponse.json();
    
    // Devolve o link pronto para a Landing Page!
    return NextResponse.json({ checkoutUrl: infiniteData.url });

  } catch (error) {
    console.error("Erro ao processar:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
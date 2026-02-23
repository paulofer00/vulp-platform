import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email"; // Verifica se o caminho está correto

export async function GET() {
  try {
    // Tenta enviar um e-mail para ti mesmo para testar
    // Coloca o teu e-mail pessoal aqui para receberes o teste
    const result = await sendWelcomeEmail("fernandespaulo330@gmail.com", "Teste VULP", "123456");

    if (result.success) {
      return NextResponse.json({ message: "E-mail enviado com sucesso! Vai ver a tua caixa de entrada." });
    } else {
      return NextResponse.json({ error: "Falha ao enviar", details: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro na rota", details: error }, { status: 500 });
  }
}
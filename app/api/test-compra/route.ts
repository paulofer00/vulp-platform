import { createCademiStudent } from "@/lib/cademi";
import { sendWelcomeEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🚀 Iniciando Simulação de Compra para o Juvenal...");

    // 1. Dados fictícios do Lead
    const lead = {
      name: "Juvenal",
      email: "juvepau69@gmail.com",
      phone: "93999999999", // Telefone genérico
    };

    // 2. ID do Curso "Posicione-se" na Cademi
    const courseIdToEnroll = "posicionese"; 

    // 3. Matricular na Cademi
    console.log("🦊 Enviando para a Cademi...");
    const cademiResult = await createCademiStudent({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      courseIds: [courseIdToEnroll] 
    });

    if (cademiResult.success) {
      console.log(`✅ Aluno matriculado com sucesso na Cademi!`);
      
      // 4. Se não vier senha, é porque ele já estava cadastrado antes
      const passwordToSend = cademiResult.password || "Você já possui cadastro na VULP! Use a sua senha antiga ou clique em 'Esqueci minha senha' no portal.";

      // 5. Enviar o E-mail de Boas-vindas
      console.log(`📧 Disparando e-mail para: ${lead.email}`);
      const emailResult = await sendWelcomeEmail(lead.email, lead.name, passwordToSend);

      return NextResponse.json({ 
        message: "Simulação concluída com sucesso! 🎉",
        cademi: "Aluno matriculado",
        emailEnviado: emailResult.success,
        aviso: "Verifique a caixa de entrada do Juvenal!"
      });

    } else {
      console.error("❌ Erro na Cademi:", cademiResult.error);
      return NextResponse.json({ error: "Erro ao criar na Cademi", detalhes: cademiResult.error }, { status: 500 });
    }

  } catch (error) {
    console.error("Erro crítico na simulação:", error);
    return NextResponse.json({ error: "Erro interno na simulação" }, { status: 500 });
  }
}
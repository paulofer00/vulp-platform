import { Resend } from 'resend';

// Verifica se a chave existe antes de tentar usar
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function sendWelcomeEmail(email: string, nome: string, pass: string) {
  if (!resend) {
    console.error("❌ ERRO: Chave RESEND_API_KEY não configurada no .env");
    return { success: false };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'VULP Education <acesso@vulp.vc>',
      to: email,
      subject: '🦊 Seu Acesso à Toca da Raposa Chegou!',
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6d28d9;">Bem-vindo à Alcateia, ${nome}! 🚀</h1>
          <p>Seu pagamento foi confirmado e seu acesso já está liberado.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">🔗 Link de Acesso:</p>
            <p style="margin-bottom: 15px;"><a href="https://vulp.cademi.com.br" style="color: #6d28d9;">vulp.cademi.com.br</a></p>
            
            <p style="margin: 0; font-weight: bold;">✉️ Seu Login:</p>
            <p style="margin-bottom: 15px; font-family: monospace; font-size: 16px;">${email}</p>
            
            <p style="margin: 0; font-weight: bold;">🔑 Sua Senha Provisória:</p>
            <p style="margin: 0; font-family: monospace; font-size: 18px; color: #000;">${pass}</p>
          </div>

          <p>Essa senha foi gerada automaticamente. Recomendamos que você a troque no seu primeiro acesso.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro ao enviar e-mail:", error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (err) {
    console.error("Erro crítico no envio de e-mail:", err);
    return { success: false, error: err };
  }
}
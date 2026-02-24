// lib/email.ts
import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(email: string, name: string, password?: string) {
  try {
    // Cria o "transportador" com os dados da Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true para a porta 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Define quem envia, quem recebe e o conteúdo
    const mailOptions = {
      from: `"VULP" <${process.env.SMTP_USER}>`, // Nome <email@dominio.com>
      to: email,
      subject: 'Bem-vindo à VULP! 🚀 O teu acesso chegou!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-w: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eaeaea;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://vulp.vc/logo-dark.png" alt="VULP" style="height: 40px;" />
          </div>

          <h2 style="color: #6b21a8; font-size: 24px; text-align: center; margin-bottom: 20px;">
            Parabéns, ${name}! A tua vaga está confirmada.
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            É oficial: a tua compra foi aprovada e acabas de dar o primeiro passo para dominar o mercado na nossa região.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Aqui estão os teus dados exclusivos de acesso à nossa plataforma de estudos:
          </p>

          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #6b21a8;">
            <p style="margin: 0 0 15px 0; font-size: 16px;">
              <strong>🔗 Link de Acesso:</strong> <br/>
              <a href="https://vulpacademy.cademi.com.br" style="color: #6b21a8; font-weight: bold; text-decoration: none;">vulp.cademi.com.br</a>
            </p>
            <p style="margin: 0 0 15px 0; font-size: 16px;">
              <strong>👤 O teu Login (E-mail):</strong> <br/>
              ${email}
            </p>
            <p style="margin: 0; font-size: 16px;">
              <strong>🔑 Senha de Acesso:</strong> <br/>
              <span style="background-color: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 18px;">
                ${password || 'Usa a senha que já registaste anteriormente'}
              </span>
            </p>
          </div>

          <p style="font-size: 14px; color: #666; background-color: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fef3c7;">
            <strong>Dica de Segurança:</strong> Recomendamos que alteres a tua senha logo no primeiro acesso para algo da tua preferência.
          </p>

          <br/>
          <p style="font-size: 16px; margin-bottom: 5px;">Vemo-nos do outro lado,</p>
          <p style="font-size: 16px; font-weight: bold; color: #6b21a8; margin-top: 0;">Equipa VULP</p>
        </div>
      `,
    };

    // Executa o envio
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ E-mail de boas-vindas enviado com sucesso! ID:", info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("❌ Erro crítico no envio de e-mail pela Hostinger:", error);
    return { success: false, error };
  }
}
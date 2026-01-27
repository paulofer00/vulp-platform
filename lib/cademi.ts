// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(email: string) {
  // 1. Verificação de Segurança das Chaves
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO CRÍTICO: Variáveis de ambiente CADEMI não encontradas.");
    return null;
  }

  const endpoint = `${CADEMI_URL}/auth/login`;
  console.log(`🔌 Conectando na Cademi: ${endpoint}`);
  console.log(`📧 Tentando logar usuário: ${email}`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": CADEMI_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email }),
    });

    // Se a API responder com erro (ex: 404, 403, 500)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP Cademi (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    console.log("✅ Resposta da Cademi:", JSON.stringify(data));

    if (data.success && data.data?.redirect_url) {
      return data.data.redirect_url;
    } else {
      console.error("⚠️ Cademi retornou sucesso: false ou sem redirect_url");
      return null;
    }

  } catch (error) {
    console.error("❌ Erro de conexão/rede:", error);
    return null;
  }
}
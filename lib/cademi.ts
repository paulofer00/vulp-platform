// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(email: string) {
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO: Variáveis de ambiente CADEMI não encontradas.");
    return null;
  }

  // CORREÇÃO: Usando GET e passando o email na URL
  // O endpoint correto geralmente é /usuario/login para pegar o link direto
  const params = new URLSearchParams({ email });
  const endpoint = `${CADEMI_URL}/usuario/login?${params.toString()}`;
  
  console.log(`🔌 Conectando na Cademi (GET): ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: "GET", // MUDANÇA IMPORTANTE: Agora é GET
      headers: {
        "Authorization": CADEMI_KEY, // A chave vai no header
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      // GET não tem "body", então removemos aquela linha
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP Cademi (${response.status}):`, errorText);
      return null;
    }

    const data = await response.json();
    console.log("✅ Resposta da Cademi:", JSON.stringify(data));

    // A Cademi costuma retornar { success: true, data: { redirect_url: "..." } }
    if (data.success && data.data?.redirect_url) {
      return data.data.redirect_url;
    } else {
      console.error("⚠️ Sucesso false ou sem redirect_url");
      return null;
    }

  } catch (error) {
    console.error("❌ Erro de conexão:", error);
    return null;
  }
}
// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(email: string) {
  // Verificação básica
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO: Chaves da Cademi não configuradas na Vercel/.env");
    return null;
  }

  const headers = {
    "Authorization": CADEMI_KEY,
    "Accept": "application/json"
  };

  try {
    // --- PASSO 1: Encontrar o ID do aluno pelo E-mail ---
    const searchParams = new URLSearchParams({ email });
    const searchEndpoint = `${CADEMI_URL}/usuario?${searchParams.toString()}`;
    
    console.log(`🔍 Buscando ID na Vulp Academy: ${email}`);
    
    const searchResponse = await fetch(searchEndpoint, { method: "GET", headers });
    
    if (!searchResponse.ok) {
       console.error(`❌ Erro HTTP ${searchResponse.status} ao buscar usuário`);
       return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.success || !searchData.data || searchData.data.length === 0) {
      console.error("❌ Aluno não encontrado na Cademi.");
      return null;
    }

    const alunoID = searchData.data[0].id;

    // --- PASSO 2: Gerar o Link Mágico com o ID ---
    const loginEndpoint = `${CADEMI_URL}/usuario/login/${alunoID}`;
    
    const loginResponse = await fetch(loginEndpoint, { method: "GET", headers });
    const loginData = await loginResponse.json();

    if (loginData.success && loginData.data?.redirect_url) {
      console.log("🚀 Link Vulp Academy gerado!");
      return loginData.data.redirect_url;
    } else {
      console.error("⚠️ Erro ao gerar link:", JSON.stringify(loginData));
      return null;
    }

  } catch (error) {
    console.error("❌ Erro de conexão Vulp Academy:", error);
    return null;
  }
}
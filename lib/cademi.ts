// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(email: string) {
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO: Chaves da Cademi não configuradas.");
    return null;
  }

  const headers = {
    "Authorization": CADEMI_KEY,
    "Accept": "application/json"
  };

  try {
    // --- PASSO 1: Encontrar o ID do aluno ---
    const searchParams = new URLSearchParams({ email });
    const searchEndpoint = `${CADEMI_URL}/usuario?${searchParams.toString()}`;
    
    console.log(`🔍 Buscando ID na Vulp Academy: ${email}`);
    
    const searchResponse = await fetch(searchEndpoint, { method: "GET", headers });
    
    // Verificando se a API rejeitou a conexão
    if (!searchResponse.ok) {
        const errText = await searchResponse.text();
        console.error(`❌ Erro HTTP ${searchResponse.status}: ${errText}`);
        return null;
    }

    const searchData = await searchResponse.json();
    console.log("📦 Resposta da Busca:", JSON.stringify(searchData)); // Log para Debug

    if (!searchData.success || !searchData.data) {
      console.error("❌ Aluno não encontrado ou erro na API.");
      return null;
    }

    // --- CORREÇÃO DO ERRO "UNDEFINED" ---
    // Aqui verificamos se 'data' é um Array (Lista) ou Objeto Único
    let alunoID;
    
    if (Array.isArray(searchData.data)) {
        // Se for lista, pega o primeiro
        if (searchData.data.length === 0) return null;
        alunoID = searchData.data[0].id;
    } else {
        // Se for objeto direto (que era o provável erro)
        alunoID = searchData.data.id;
    }

    if (!alunoID) {
        console.error("❌ ID não encontrado na resposta.");
        return null;
    }

    // --- PASSO 2: Gerar Link ---
    const loginEndpoint = `${CADEMI_URL}/usuario/login/${alunoID}`;
    const loginResponse = await fetch(loginEndpoint, { method: "GET", headers });
    const loginData = await loginResponse.json();

    if (loginData.success && loginData.data?.redirect_url) {
      console.log("🚀 Link gerado!");
      return loginData.data.redirect_url;
    } else {
      console.error("⚠️ Erro ao gerar link:", JSON.stringify(loginData));
      return null;
    }

  } catch (error) {
    console.error("❌ Erro Crítico:", error);
    return null;
  }
}
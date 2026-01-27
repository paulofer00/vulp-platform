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
    // --- PASSO 1: Encontrar o ID do aluno pelo E-mail ---
    // Usamos o filtro ?email=... ou ?search=... (depende da versão, mas email costuma funcionar)
    const searchParams = new URLSearchParams({ email });
    const searchEndpoint = `${CADEMI_URL}/usuario?${searchParams.toString()}`;
    
    console.log(`🔍 [1/2] Buscando ID do aluno: ${email}`);
    
    const searchResponse = await fetch(searchEndpoint, { method: "GET", headers });
    const searchData = await searchResponse.json();

    // Verifica se encontrou alguém
    if (!searchData.success || !searchData.data || searchData.data.length === 0) {
      console.error("❌ Aluno não encontrado na Cademi com este e-mail.");
      return null;
    }

    // Pega o ID do primeiro aluno da lista
    const alunoID = searchData.data[0].id;
    console.log(`✅ ID Encontrado: ${alunoID}`);

    // --- PASSO 2: Gerar o Link Mágico usando o ID ---
    const loginEndpoint = `${CADEMI_URL}/usuario/login/${alunoID}`;
    console.log(`🔌 [2/2] Gerando link de acesso...`);

    const loginResponse = await fetch(loginEndpoint, { method: "GET", headers });
    const loginData = await loginResponse.json();

    if (loginData.success && loginData.data?.redirect_url) {
      console.log("🚀 Link gerado com sucesso!");
      return loginData.data.redirect_url;
    } else {
      console.error("⚠️ Erro ao gerar link final:", JSON.stringify(loginData));
      return null;
    }

  } catch (error) {
    console.error("❌ Erro de conexão com a Cademi:", error);
    return null;
  }
}
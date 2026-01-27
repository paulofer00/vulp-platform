// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(rawEmail: string) {
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO: Chaves não configuradas.");
    return null;
  }

  // 1. Limpeza do E-mail (Remove espaços e deixa minúsculo)
  const email = rawEmail.trim().toLowerCase();

  const headers = {
    "Authorization": CADEMI_KEY,
    "Accept": "application/json"
  };

  try {
    // --- TENTATIVA 1: Busca Exata por E-mail ---
    let alunoID = await buscarID(email, "email", headers);

    // --- TENTATIVA 2: Busca Genérica (search) se a 1 falhar ---
    if (!alunoID) {
        console.warn(`⚠️ Busca exata falhou. Tentando busca genérica...`);
        alunoID = await buscarID(email, "search", headers);
    }

    if (!alunoID) {
      console.error(`❌ DESISTINDO: Aluno ${email} não encontrado na Cademi (Lista vazia).`);
      // Aqui poderíamos criar o aluno se fosse o caso, mas vamos focar no erro.
      return null;
    }

    // --- PASSO FINAL: Gerar Link com o ID encontrado ---
    const loginEndpoint = `${CADEMI_URL}/usuario/login/${alunoID}`;
    const loginResponse = await fetch(loginEndpoint, { method: "GET", headers });
    const loginData = await loginResponse.json();

    if (loginData.success && loginData.data?.redirect_url) {
      console.log("🚀 SUCESSO: Link gerado!");
      return loginData.data.redirect_url;
    } else {
      console.error("⚠️ Erro ao gerar link final:", JSON.stringify(loginData));
      return null;
    }

  } catch (error) {
    console.error("❌ Erro Crítico de Conexão:", error);
    return null;
  }
}

// Função auxiliar para tentar buscar com parâmetros diferentes
async function buscarID(valor: string, paramName: string, headers: any) {
    const params = new URLSearchParams({ [paramName]: valor });
    const endpoint = `${CADEMI_URL}/usuario?${params.toString()}`;
    
    console.log(`🔍 Buscando ID via [${paramName}]: ${endpoint}`);
    
    const response = await fetch(endpoint, { method: "GET", headers });
    
    if (!response.ok) {
        console.error(`❌ Erro HTTP ${response.status} na busca.`);
        return null;
    }

    const json = await response.json();
    
    // Log para você ver na Vercel o que exatamente voltou
    console.log(`📦 Resposta Raw [${paramName}]:`, JSON.stringify(json));

    if (!json.success || !json.data) return null;

    // Se for lista
    if (Array.isArray(json.data)) {
        if (json.data.length > 0) {
            // Encontrou! Retorna o ID do primeiro da lista
            return json.data[0].id;
        }
        return null; // Lista vazia
    } 
    
    // Se for objeto único
    if (json.data.id) {
        return json.data.id;
    }

    return null;
}
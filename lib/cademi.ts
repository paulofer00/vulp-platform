// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

export async function getCademiLoginToken(rawEmail: string) {
  if (!CADEMI_URL || !CADEMI_KEY) {
    console.error("❌ ERRO: Chaves não configuradas.");
    return null;
  }

  // Limpa o e-mail
  const email = rawEmail.trim().toLowerCase();

  const headers = {
    "Authorization": CADEMI_KEY,
    "Accept": "application/json"
  };

  try {
    // --- PASSO 1: Buscar dados do usuário ---
    // Endpoint: /usuario/{email}
    const userEndpoint = `${CADEMI_URL}/usuario/${email}`;
    console.log(`🔍 Buscando usuário: ${userEndpoint}`);
    
    const userResponse = await fetch(userEndpoint, { method: "GET", headers });
    
    if (!userResponse.ok) {
        console.error(`❌ Erro HTTP ${userResponse.status} ao buscar usuário.`);
        return null;
    }

    const userData = await userResponse.json();
    console.log("📦 Resposta Bruta:", JSON.stringify(userData));

    let alunoID;

    if (userData.success && userData.data) {
        // LÓGICA BLINDADA: Verifica todos os formatos possíveis
        
        // 1. Se for Lista (Array)
        if (Array.isArray(userData.data)) {
            alunoID = userData.data[0]?.id;
        } 
        // 2. Se for Objeto com ID direto
        else if (userData.data.id) {
            alunoID = userData.data.id;
        }
        // 3. O CASO QUE ESTÁ ACONTECENDO: Objeto onde a chave é o e-mail
        else {
            const keys = Object.keys(userData.data);
            if (keys.length > 0) {
                const primeiraChave = keys[0]; // Pega "btrzcancio@gmail.com" dinamicamente
                const dadosAluno = userData.data[primeiraChave];
                alunoID = dadosAluno?.id;
            }
        }
    }

    if (!alunoID) {
        console.error("❌ ID não encontrado dentro da estrutura 'data'.");
        return null;
    }

    console.log(`✅ ID Confirmado: ${alunoID}`);

    // --- PASSO 2: Gerar Link de Login ---
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
    console.error("❌ Erro Crítico:", error);
    return null;
  }
}
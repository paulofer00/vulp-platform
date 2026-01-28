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
    // --- TENTATIVA NOVA: Buscar direto pela URL (conforme print da doc) ---
    // Endpoint: /usuario/{email}
    const userEndpoint = `${CADEMI_URL}/usuario/${email}`;
    
    console.log(`🔍 Buscando dados diretos: ${userEndpoint}`);
    
    const userResponse = await fetch(userEndpoint, { method: "GET", headers });
    
    // Se der 404, o usuário realmente não existe
    if (userResponse.status === 404) {
        console.error("❌ Usuário não existe na Cademi.");
        return null;
    }

    const userData = await userResponse.json();
    console.log("📦 Resposta User:", JSON.stringify(userData));

    // A API deve retornar o objeto do usuário direto dentro de 'data'
    let alunoID;

    if (userData.success && userData.data) {
        // As vezes volta array, as vezes objeto. Garantimos aqui:
        if (Array.isArray(userData.data)) {
            alunoID = userData.data[0]?.id;
        } else {
            alunoID = userData.data.id;
        }
    }

    if (!alunoID) {
        console.error("❌ ID não encontrado na resposta do usuário.");
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
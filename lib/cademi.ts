const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

// --- FUNÇÃO 1: LOGIN ---
export async function getCademiLoginToken(rawEmail: string) {
  if (!CADEMI_URL || !CADEMI_KEY) return null;

  const email = rawEmail.trim().toLowerCase();
  const headers = {
    "Authorization": CADEMI_KEY,
    "Accept": "application/json"
  };

  try {
    const userEndpoint = `${CADEMI_URL}/usuario/${email}`;
    const userResponse = await fetch(userEndpoint, { method: "GET", headers });

    if (!userResponse.ok) return null;

    const userData = await userResponse.json();
    let alunoID;

    if (userData.success && userData.data) {
        if (Array.isArray(userData.data)) {
            alunoID = userData.data[0]?.id;
        } else if (userData.data.id) {
            alunoID = userData.data.id;
        } else {
            const keys = Object.keys(userData.data);
            if (keys.length > 0) {
                const dadosAluno = userData.data[keys[0]];
                alunoID = dadosAluno?.id;
            }
        }
    }

    if (!alunoID) return null;

    const loginEndpoint = `${CADEMI_URL}/usuario/login/${alunoID}`;
    const loginResponse = await fetch(loginEndpoint, { method: "GET", headers });
    const loginData = await loginResponse.json();

    if (loginData.success && loginData.data?.redirect_url) {
      return loginData.data.redirect_url;
    }
    return null;

  } catch (error) {
    console.error("Erro Cademi Login:", error);
    return null;
  }
}

// --- FUNÇÃO 2: DADOS PÚBLICOS ---
export async function getAlunoPublico(email: string) {
  if (!CADEMI_URL || !CADEMI_KEY) return null;

  try {
    const response = await fetch(`${CADEMI_URL}/usuario/${email}`, {
      method: "GET",
      headers: {
        "Authorization": CADEMI_KEY,
        "Accept": "application/json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) return null;

    const json = await response.json();
    let dadosAluno = null;

    if (json.success && json.data) {
        if (Array.isArray(json.data)) {
            dadosAluno = json.data[0];
        } else if (json.data.id) {
            dadosAluno = json.data;
        } else {
            const keys = Object.keys(json.data);
            if (keys.length > 0) {
                dadosAluno = json.data[keys[0]];
            }
        }
    }

    if (!dadosAluno) return null;

    return {
      pontos: dadosAluno.pontos || 0,
      id: dadosAluno.id,
      nome: dadosAluno.nome
    };

  } catch (error) {
    console.error("Erro ao buscar pontos:", error);
    return null;
  }
}

// --- FUNÇÃO 3: PROGRESSO DO CURSO (CORRIGIDA) ---
export async function getProgressoCurso(email: string, produtoId: string) {
  if (!CADEMI_URL || !CADEMI_KEY) return null;

  try {
    const endpoint = `${CADEMI_URL}/usuario/progresso_por_produto/${email}/${produtoId}`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Authorization": CADEMI_KEY,
        "Accept": "application/json"
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) return null;

    const json = await response.json();
    
    if (json.success && json.data && json.data.progresso) {
        const percentString = json.data.progresso.total || "0%";
        const percentNumber = parseInt(percentString.replace("%", "")) || 0;

        // CORREÇÃO AQUI:
        // 'assistidas': Aulas que o aluno viu
        // 'aulas.length': Total de aulas que existem no curso
        const totalAulasReais = json.data.progresso.aulas ? json.data.progresso.aulas.length : 0;

        return {
            porcentagem: percentNumber,
            assistidas: json.data.progresso.assistidas || 0,
            total_aulas: totalAulasReais, 
            concluido: percentNumber === 100
        };
    }
    
    return null;

  } catch (error) {
    console.error(`Erro ao buscar progresso do curso ${produtoId}:`, error);
    return null;
  }
}
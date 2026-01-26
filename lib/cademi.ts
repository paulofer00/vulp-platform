// src/lib/cademi.ts

const CADEMI_URL = process.env.CADEMI_API_URL;
const CADEMI_KEY = process.env.CADEMI_API_KEY;

if (!CADEMI_URL || !CADEMI_KEY) {
  console.error("ERRO: Faltam as variáveis de ambiente da Cademi no .env.local");
}

// Função auxiliar para fazer as chamadas
async function cademiFetch(endpoint: string, method: string = "GET", body?: any) {
  const headers = {
    "Authorization": CADEMI_KEY!,
    "Content-Type": "application/json",
    "Accept": "application/json"
  };

  try {
    const response = await fetch(`${CADEMI_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro na requisição Cademi [${endpoint}]:`, error);
    return null;
  }
}

/**
 * 1. Cria ou Atualiza um usuário na Cademi
 * Quando o aluno comprar na VULP, chamamos isso.
 */
export async function syncUserToCademi(user: { email: string, name: string, phone?: string, doc?: string }) {
  // O endpoint geralmente é /usuario para criar/editar
  const payload = {
    nome: user.name,
    email: user.email,
    celular: user.phone || "",
    documento: user.doc || "", // CPF/CNPJ se tiver
    // Aqui você pode adicionar campos extras se a Cademi exigir
  };

  const result = await cademiFetch("/usuario", "POST", payload);
  return result;
}

/**
 * 2. Gera o Link Mágico de Login (SSO)
 * Quando o aluno clicar em "Acessar Aulas" no painel.
 */
export async function getCademiLoginToken(email: string) {
  // Endpoint de login automático (verificar na doc "Usuário > Login" ou "Auth")
  // Geralmente é algo como /usuario/login ou /auth/login
  // Vou usar o padrão comum, se der erro ajustamos com a doc exata
  const result = await cademiFetch(`/usuario/login`, "POST", { email });
  
  if (result && result.success && result.data?.redirect_url) {
    return result.data.redirect_url; // Retorna o link mágico
  }
  
  return null;
}
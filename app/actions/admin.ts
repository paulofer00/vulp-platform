'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function createUserAsAdmin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const name = formData.get('name') as string

  // 1. Criar o Usuário na Autenticação
  const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  })

  if (authError) {
    return { error: 'Erro no Auth: ' + authError.message }
  }

  if (!user.user) {
    return { error: 'Erro desconhecido ao criar usuário.' }
  }

  // 2. Criar ou Atualizar o Perfil (CORREÇÃO AQUI 👇)
  // Usamos 'upsert' para não travar se o Trigger já tiver criado o perfil
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.user.id,
      email: email,
      role: role
    })

  if (profileError) {
    return { error: 'Erro ao salvar perfil: ' + profileError.message }
  }

  // 3. Se for ALUNO, criar a ficha de aluno
  if (role === 'student') {
    // Também usamos upsert aqui por segurança
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .upsert({
        id: user.user.id,
        email: email,
        full_name: name,
        points: 0
      })
    
    if (studentError) {
        return { error: 'Erro ao criar ficha de aluno: ' + studentError.message }
    }
  }

  return { success: true }
}   // ... (mantenha o código anterior do createUserAsAdmin aqui)

// 1. BUSCAR TODOS OS USUÁRIOS
export async function getUsersForAdmin() {
  // Busca perfis
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !profiles) return [];

  // Busca nomes dos alunos para complementar
  const { data: students } = await supabaseAdmin
    .from('students')
    .select('id, full_name');

  // Junta as informações (Map)
  const usersWithNames = profiles.map(profile => {
    const student = students?.find(s => s.id === profile.id);
    return {
      ...profile,
      full_name: student?.full_name || 'Empresa / Admin' // Se não achar aluno, é empresa ou admin
    };
  });

  return usersWithNames;
}

// 2. DELETAR USUÁRIO (BAN HAMMER 🚫)
export async function deleteUserAsAdmin(userId: string) {
  // A função admin.deleteUser remove do Authentication E do banco (cascade)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
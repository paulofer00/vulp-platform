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
}
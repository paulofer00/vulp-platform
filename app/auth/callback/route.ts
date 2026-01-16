import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/"; // Se não tiver destino, vai pra Home

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignorar erro em server components
            }
          },
        },
      }
    );

    // Troca o código pela sessão do usuário
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Se deu certo, manda o usuário para o dashboard correto
      // Podemos checar o role aqui se quiser ser mais específico, 
      // mas mandar para a Home (que redireciona) é seguro.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Se der erro, manda pra uma página de erro
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
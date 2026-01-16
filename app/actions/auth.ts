'use server'

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
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
                // Ocorre se for chamado de um Server Component, mas não trava o logout
            }
        },
      },
    }
  );

  // Desloga do Supabase
  await supabase.auth.signOut();
  
  // Redireciona para a Home
  redirect("/");
}
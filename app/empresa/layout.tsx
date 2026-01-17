import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, Building2, ArrowLeft } from "lucide-react";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Configuração de Cookies e Segurança (Essencial!)
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR FIXA (Tema Claro: Branco com Borda Cinza) */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-8">
             <Link href="/empresa/dashboard" className="cursor-pointer block hover:opacity-80 transition-opacity">
                {/* Logo Dark para fundo Branco */}
                <img src="/logo-dark.png" alt="VULP Business" className="h-8 w-auto" />
             </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Menu da Empresa</p>

            <Link href="/empresa/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <LayoutDashboard size={20} /> Visão Geral
            </Link>
            <Link href="/vitrine" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Users size={20} /> Banco de Talentos
            </Link>
            <Link href="/empresa/vagas" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Briefcase size={20} /> Minhas Vagas
            </Link>
            <Link href="/empresa/perfil" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Building2 size={20} /> Meu Perfil
            </Link>
        </nav>

        {/* Link Voltar para Home (Ajustado para fundo claro) */}
        <div className="p-4 mt-auto border-t border-slate-100">
            <Link 
              href="/" 
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors font-medium text-sm"
            >
                <ArrowLeft size={18} /> Voltar para Home
            </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>

    </div>
  );
}
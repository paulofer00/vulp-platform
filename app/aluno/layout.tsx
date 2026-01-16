import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, User, Briefcase, BookOpen, Trophy, ArrowLeft } from "lucide-react"; 

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CORREÇÃO CRÍTICA: Adicionado 'await' aqui
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar erros de escrita em Server Component
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  // Se não estiver logado, manda pro login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      
      {/* SIDEBAR LATERAL FIXA */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] hidden md:flex flex-col fixed h-full z-10">
        <div className="p-8">
          {/* LOGO (Usando a versão WHITE para fundo escuro) */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo-white.svg" alt="VULP" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Menu Principal</p>
          
          <Link href="/aluno/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-white/5 rounded-xl border border-white/5">
            <LayoutDashboard size={18} className="text-purple-400" /> Dashboard
          </Link>
          <Link href="/aluno/perfil" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <User size={18} /> Editar Perfil
          </Link>
          <Link href="/aluno/vagas" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Briefcase size={18} /> Mercado de Vagas
          </Link>
          <Link href="/aluno/cursos" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <BookOpen size={18} /> Meus Cursos
          </Link>
          <Link href="/aluno/conquistas" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Trophy size={18} /> Conquistas
          </Link>
        </nav>

        {/* Botão Voltar para Home */}
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft size={18} /> Voltar para Home
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 md:ml-64 p-8 md:p-12"> 
        {children}
      </main>
    </div>
  );
}
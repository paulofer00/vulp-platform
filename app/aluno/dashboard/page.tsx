import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BookOpen, LogOut, PlayCircle, Trophy, User, Zap, Briefcase } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  // 1. Configurar o Cliente Supabase para Next.js 15
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // 2. Verificar quem está logado
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 3. Buscar os dados do aluno no banco
  const { data: student } = await supabase
    .from("students")
    .select("*, student_medals(*)")
    .eq("id", session.user.id)
    .single();

  // Dados provisórios caso o perfil ainda não tenha carregado
  const studentName = student?.full_name || session.user.email?.split("@")[0] || "Aluno";
  const studentXP = student?.points || 0;
  const medalCount = student?.student_medals?.length || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0A0A0A] border-r border-white/5 flex flex-col z-20">
        <div className="p-8">
            <div className="font-bold text-2xl tracking-tighter text-white">
                VULP<span className="text-purple-600">.</span> <span className="text-xs text-purple-400 font-normal uppercase tracking-widest ml-1">Student</span>
            </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {/* Link para EDITAR Perfil */}
          <Link href="/aluno/perfil" className="flex items-center gap-3 px-4 py-3 bg-purple-600/10 text-purple-400 border border-purple-600/20 rounded-xl font-bold text-sm transition-colors shadow-[0_0_20px_rgba(147,51,234,0.1)]">
            <User size={20} /> Editar Perfil
          </Link>
          
          {/* Link NOVO para Vagas */}
          <Link href="/aluno/vagas" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <Briefcase size={20} /> Mercado de Vagas
          </Link>

          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <PlayCircle size={20} /> Meus Cursos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <Trophy size={20} /> Conquistas
          </a>
        </nav>

        <div className="p-8 border-t border-white/5">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm font-medium transition-colors">
                <LogOut size={16} /> Sair
            </Link>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 ml-64 p-8 md:p-12 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

        <header className="flex justify-between items-end mb-12 relative z-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Olá, {studentName}.</h1>
                <p className="text-gray-400">Continue sua jornada para o topo do ranking.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 pr-6 rounded-full">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-white uppercase">
                    {studentName.charAt(0)}
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">Nível Atual</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400 fill-yellow-400" /> {studentXP} XP
                    </p>
                </div>
            </div>
        </header>

        {/* Cards de Progresso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <PlayCircle size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white">0/5</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Cursos em Andamento</p>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-purple-600 w-[5%]"></div>
                </div>
            </div>

            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-white/5 rounded-xl text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                        <Trophy size={24} />
                    </div>
                    <span className="text-2xl font-bold text-white">{medalCount}</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Medalhas Conquistadas</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-[#0A0A0A] p-6 rounded-2xl border border-purple-500/30 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">Acessar Vitrine</h3>
                    <p className="text-sm text-purple-200/60 mb-4">Veja como seu perfil aparece para as empresas.</p>
                    <Link href={`/talento/${session.user.id}`} className="inline-flex items-center gap-2 text-xs font-bold bg-white text-purple-900 px-3 py-2 rounded-lg">
                        Ver meu Perfil Público <Zap size={12}/>
                    </Link>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <User size={100} />
                </div>
            </div>
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-500" /> Meus Cursos
        </h2>
        
        <div className="space-y-4">
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors opacity-80">
                <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center">
                    <BookOpen className="text-gray-500" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-300">Você ainda não iniciou cursos</h3>
                    <p className="text-sm text-gray-600">Acesse a Cademi para começar sua jornada.</p>
                </div>
                <Link href="https://vulp.cademi.com.br" target="_blank" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm transition-all hover:bg-purple-700">
                    Ir para Área de Aulas
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}
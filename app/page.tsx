export const dynamic = "force-dynamic";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ArrowRight, PlayCircle, Users } from "lucide-react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

export default async function Home() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  let profile = null;

  if (session) {
      // 1. Descobre quem é (Aluno, Empresa ou Admin)
      const { data: baseProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      
      const role = baseProfile?.role;
      
      // Nome Provisório (caso não ache nada no banco)
      const emailName = session.user.email?.split("@")[0] || "Usuário";
      let fullName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      let avatarUrl = null;

      // 2. Busca os dados na tabela correta
      if (role === 'student') {
          const { data: student } = await supabase
            .from("students")
            .select("full_name, avatar_url")
            .eq("id", session.user.id)
            .single();
          
          if (student) {
              if (student.full_name) fullName = student.full_name;
              if (student.avatar_url) avatarUrl = student.avatar_url;
          }

      } else if (role === 'company') {
          // AQUI ESTÁ A MÁGICA PARA A EMPRESA 🎩✨
          const { data: company } = await supabase
            .from("companies")
            .select("name, logo_url")
            .eq("id", session.user.id)
            .single();

          if (company) {
              if (company.name) fullName = company.name;     // Usa o Nome Fantasia
              if (company.logo_url) avatarUrl = company.logo_url; // Usa a Logo
          }
      }

      // 3. Monta o perfil para o Menu
      profile = {
          role: role,
          full_name: fullName,
          avatar_url: avatarUrl
      };
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAV BAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="cursor-pointer">
             <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/vitrine" className="hover:text-white transition-colors">Talentos</Link>
            <Link href="/empresas" className="hover:text-white transition-colors">Para Empresas</Link>
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
          </div>

          <div className="flex items-center gap-4">
            
            {session ? (
                // O Menu agora vai receber a Logo da empresa em vez da letra inicial
                <UserMenu />
            ) : (
                <>
                    <Link href="/login" className="text-sm font-bold hover:text-purple-400 transition-colors hidden md:block">
                        Entrar
                    </Link>
                    <Link href="/cadastro" className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                        Começar Agora
                    </Link>
                </>
            )}

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Nova Plataforma Disponível
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent max-w-4xl mx-auto pb-2">
                Onde talentos jovens encontram grandes oportunidades.
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                A VULP conecta alunos capacitados a empresas que buscam inovação.
                Treinamento, certificação e mercado de trabalho em um só lugar.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                {session ? (
                     <Link href={profile?.role === 'company' ? "/empresa/dashboard" : (profile?.role === 'admin' ? "/admin" : "/aluno/dashboard")} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 hover:scale-105">
                        <Users size={20} /> Acessar meu Painel
                     </Link>
                ) : (
                    <Link href="/cadastro" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 hover:scale-105">
                        Quero me Cadastrar <ArrowRight size={20} />
                    </Link>
                )}
                
                <Link href="/vitrine" className="px-8 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-white/5 flex items-center gap-2 transition-all">
                    <PlayCircle size={20} /> Ver Vitrine
                </Link>
            </div>
        </div>
      </main>

    </div>
  );
}
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import UserMenu from "@/components/UserMenu"; 

export default async function Home() {
  // CORREÇÃO: Adicionado 'await' porque no Next.js 15 cookies são assíncronos
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
            // Ignora erros de escrita em Server Component
          }
        },
      },
    }
  );

  // Verifica sessão
  const { data: { session } } = await supabase.auth.getSession();
  
  let dashboardLink = "/login";
  if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
        
      dashboardLink = profile?.role === 'company' ? '/empresa/dashboard' : '/aluno/dashboard';
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="VULP" className="h-8" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Talentos</Link>
            <Link href="#" className="hover:text-white transition-colors">Para Empresas</Link>
            <Link href="#" className="hover:text-white transition-colors">Sobre</Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 px-4 py-2">
                  Entrar
                </Link>
                <Link href="/cadastro" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                  Começar Agora
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 animate-in fade-in zoom-in duration-500">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Nova Plataforma Disponível
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Onde talentos jovens <br />
            <span className="text-gray-500">encontram grandes oportunidades.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            A VULP conecta alunos capacitados a empresas que buscam inovação.
            Treinamento, certificação e mercado de trabalho em um só lugar.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {session ? (
                <Link href={dashboardLink} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                    Acessar meu Painel
                </Link>
            ) : (
                <Link href="/cadastro" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
                    Quero me Cadastrar
                </Link>
            )}
            
            <button className="w-full md:w-auto px-8 py-4 rounded-full font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Ver Vitrine
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
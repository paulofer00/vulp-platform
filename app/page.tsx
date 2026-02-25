import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import UserMenu from "@/components/UserMenu"; 
import FoxLottie from "@/components/FoxLottie"; 
import { MentorsSection } from "@/components/MentorsSection";
import MouseTrail from "@/components/MouseTrail";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, CheckCircle2, MessageCircle, Target, Zap, Users } from "lucide-react";
import VideoManifesto from "@/components/VideoManifesto";
import { ExplodingBrands } from "@/components/ExplodingBrands";
import { InfiniteAnswers } from "@/components/InfiniteAnswers";
import { DiferenciaisScroll } from "@/components/DiferenciaisScroll";

export default async function Home() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans relative">
      
      <MouseTrail />
      <FoxLottie />

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 px-4 py-2 hidden md:block">
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

      {/* --- 1. HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative flex flex-col items-center text-center z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto w-full">
            
            <ScrollReveal>
                {/* 👇 AJUSTE AQUI: text-4xl no mobile, text-5xl em telas médias, text-7xl no PC */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                    UMA ESCOLA <br />
                    {/* 👇 AJUSTE AQUI: whitespace-nowrap impede a quebra de linha! 👇 */}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300 whitespace-nowrap">
                        NADA CONVENCIONAL
                    </span>
                </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16 font-medium">
                    Uma formação 100% prática e presencial, feita para quem quer entrar no mercado de verdade, não apenas ganhar um certificado.
                </p>
            </ScrollReveal>

            {/* VÍDEO NO MEIO DA HERO */}
            <ScrollReveal delay={0.4}>
                <div className="w-full mb-16">
                    <VideoManifesto />
                </div>
            </ScrollReveal>

            {/* BOTÃO ABAIXO DO VÍDEO */}
            <ScrollReveal delay={0.6}>
                <div className="flex justify-center">
                    <Link 
                        href="/posicione-se" 
                        className="group bg-purple-600 hover:bg-white text-white hover:text-purple-600 px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-110 shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)] flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                        Posicione-se Agora 
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </ScrollReveal>

        </div>
      </section>
      
      {/* --- 2. PRA QUEM É (EXPLOSÃO 3D + CARROSSEL) --- */}
      <ExplodingBrands />
      <InfiniteAnswers />

      {/* --- 3. ESCOLHA SEU CAMINHO --- */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
            <ScrollReveal>
                <h2 className="text-center text-3xl md:text-5xl font-bold mb-16">Escolha seu caminho</h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <ScrollReveal delay={0.1}>
                    <Link href="/marketing" className="group relative block bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 md:p-10 hover:border-purple-500 transition-all duration-300 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full group-hover:bg-purple-600/20 transition-all" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-purple-400 transition-colors">Raposa do Marketing</h3>
                            <p className="text-gray-400 text-lg mb-8 md:h-20">Domine as estratégias digitais, criação de conteúdo e gestão de marcas que vendem.</p>
                            <span className="inline-flex items-center gap-2 text-white font-bold border-b border-purple-500 pb-1 group-hover:text-purple-400 transition-colors">Conhecer a formação <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                    <Link href="/vendas" className="group relative block bg-[#0F0F0F] border border-white/10 rounded-3xl p-8 md:p-10 hover:border-blue-500 transition-all duration-300 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-blue-400 transition-colors">O Novo Vendedor</h3>
                            <p className="text-gray-400 text-lg mb-8 md:h-20">Aprenda a negociar, persuadir e fechar contratos de alto valor em qualquer cenário.</p>
                            <span className="inline-flex items-center gap-2 text-white font-bold border-b border-blue-500 pb-1 group-hover:text-blue-400 transition-colors">Conhecer a formação <ArrowRight size={16} /></span>
                        </div>
                    </Link>
                </ScrollReveal>

            </div>
        </div>
      </section>

      {/* --- 4. DIFERENCIAIS (SCROLL HORIZONTAL 3D) --- */}
      <DiferenciaisScroll />

      {/* --- 5. MENTORES --- */}
      <ScrollReveal>
          <MentorsSection />
      </ScrollReveal>

      {/* --- 6. CTA WHATSAPP --- */}
      <section className="py-24 px-6 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
            <ScrollReveal>
                <h2 className="text-3xl font-bold mb-8">Ainda com dúvida de qual caminho seguir?</h2>
                <Link 
                    href="https://wa.me/5593992185577"
                    target="_blank"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-4 px-8 md:px-10 rounded-full text-lg transition-all hover:scale-105 shadow-xl shadow-green-900/20 inline-flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                    <MessageCircle size={24} fill="black" className="text-black" />
                    Quero conversar com a VULP
                </Link>
            </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm relative z-10">
        <p>© 2026 VULP. Todos os direitos reservados.</p>
      </footer>

    </main>
  );
}
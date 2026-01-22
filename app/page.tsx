import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import UserMenu from "@/components/UserMenu"; 
// CORREÇÃO AQUI: Adicionamos chaves { } na importação
import { HeroSlider } from "@/components/HeroSlider"; 

export default async function Home() {
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
            // Ignora erros
          }
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/empresas" className="hover:text-white transition-colors">Para Empresas</Link>
            <Link href="/vitrine" className="hover:text-white transition-colors text-purple-400 font-bold">Vitrine</Link>
            <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
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

      {/* HERO SLIDER */}
      <section className="relative">
        <HeroSlider />
      </section>

    </main>
  );
}
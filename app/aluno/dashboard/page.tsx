"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Trophy, Building2, BookOpen, ExternalLink } from "lucide-react"; // Adicionei ExternalLink
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

// Removi a importação do ClassroomButton pois vamos usar link direto agora

export default function AlunoDashboard() {
  const [firstName, setFirstName] = useState("Aluno");
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (profile?.role === 'company') {
            router.push('/empresa/dashboard');
            return;
        }

        if (profile?.full_name) {
          const first = profile.full_name.split(" ")[0];
          setFirstName(first);
        }
      }
      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Carregando painel...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Olá, {firstName}.
          </h1>
          <p className="text-gray-400 mt-1">
            Continue sua jornada para o topo do ranking.
          </p>
        </div>
        <UserMenu />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Cursos em Andamento */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 relative z-10">
              <PlayCircle size={32} />
            </div>
            {/* Ícone de fundo decorativo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500/5 blur-sm scale-[2.5] pointer-events-none">
                <PlayCircle size={32} />
            </div>
          </div>
          <div className="relative z-10 w-full">
            <h3 className="text-3xl font-bold text-white mb-1">0/5</h3>
            <p className="text-gray-400 text-sm">Cursos em Andamento</p>
            {/* Barra de progresso centralizada */}
            <div className="w-full max-w-[120px] mx-auto bg-white/10 h-1.5 mt-4 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[10%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Medalhas */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-400 relative z-10">
              <Trophy size={32} />
            </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500/5 blur-sm scale-[2.5] pointer-events-none">
                <Trophy size={32} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-1">0</h3>
            <p className="text-gray-400 text-sm">Medalhas Conquistadas</p>
          </div>
        </div>

        {/* Card 3: Empresas */}
        <div className="bg-gradient-to-b from-[#130821] to-[#0A0A0A] border border-purple-500/20 p-8 rounded-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 w-full flex flex-col items-center">
             <div className="p-4 bg-white/5 rounded-2xl text-white mb-4">
                <Building2 size={32} />
             </div>
            <h3 className="text-xl font-bold text-white mb-2">Conheça as Empresas</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-[200px]">Veja quem está contratando e prepare-se para o mercado.</p>
            <Link href="/aluno/empresas" className="w-full bg-white text-black font-bold py-3 rounded-xl text-center text-sm hover:bg-gray-200 transition-colors shadow-lg hover:scale-[1.02] active:scale-95">
              Ver Vitrine de Empresas
            </Link>
          </div>
        </div>

      </div>

      {/* SEÇÃO MEUS CURSOS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={20} className="text-purple-400" /> Meus Cursos
        </h2>
        
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500">
                <BookOpen size={32} />
            </div>
            <h3 className="text-white font-bold mb-2">Você ainda não iniciou cursos</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                Acesse a área de membros para começar sua jornada de aprendizado profissional.
            </p>
            
            {/* --- BOTÃO NOVO (Link Direto) --- */}
            <div className="flex justify-center">
                <a 
                    href="https://vulpacademy.cademi.com.br/login" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-95"
                >
                    <PlayCircle size={20} />
                    Ir para Área de Aulas
                    <ExternalLink size={16} className="opacity-50" />
                </a>
            </div>

        </div>
      </div>

    </div>
  );
}
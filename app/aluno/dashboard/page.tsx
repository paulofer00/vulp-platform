"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { PlayCircle, Trophy, Building2, BookOpen } from "lucide-react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";

export default function AlunoDashboard() {
  const [firstName, setFirstName] = useState("Aluno");
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          // Pega apenas o primeiro nome (Ex: "Paulo Fernandes" -> "Paulo")
          const first = profile.full_name.split(" ")[0];
          setFirstName(first);
        }
      }
      setLoading(false);
    }

    getProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* CABEÇALHO COM USER MENU */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Olá, {firstName}.
          </h1>
          <p className="text-gray-400 mt-1">
            Continue sua jornada para o topo do ranking.
          </p>
        </div>

        {/* O Menu agora é independente e busca seus próprios dados */}
        <UserMenu />
      </div>

      {/* GRID DE CARDS (Mantive o layout do seu print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Cursos em Andamento */}
        <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <PlayCircle size={24} />
            </div>
            <div className="text-white/10 group-hover:text-purple-500/10 transition-colors">
              <PlayCircle size={48} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">0/5</h3>
            <p className="text-gray-400 text-sm mt-1">Cursos em Andamento</p>
            <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[10%]" />
            </div>
          </div>
        </div>

        {/* Card 2: Medalhas */}
        <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
              <Trophy size={24} />
            </div>
            <div className="text-white/10 group-hover:text-yellow-500/10 transition-colors">
              <Trophy size={48} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white">0</h3>
            <p className="text-gray-400 text-sm mt-1">Medalhas Conquistadas</p>
          </div>
        </div>

        {/* Card 3: Empresas (CTA) */}
        <div className="bg-gradient-to-br from-[#1a0b2e] to-[#0A0A0A] border border-purple-500/20 p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Conheça as Empresas</h3>
            <p className="text-gray-400 text-xs mb-4">Veja quem está contratando e prepare-se.</p>
            <Link href="/aluno/empresas" className="block w-full bg-white text-black font-bold py-2.5 rounded-lg text-center text-sm hover:bg-gray-200 transition-colors">
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
            <Link href="/aluno/cursos" className="inline-flex bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Ir para Área de Aulas
            </Link>
        </div>
      </div>

    </div>
  );
}
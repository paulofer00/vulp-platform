"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Zap, PlayCircle, Trophy, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserMenu from "@/components/UserMenu"; // O menu do topo continua aqui

export default function StudentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("students").select("*").eq("id", user.id).single();
        setStudent(data);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  return (
    <div className="p-8 md:p-12 relative">
        
        {/* CABEÇALHO COM MENU DO USUÁRIO */}
        <header className="flex justify-between items-center mb-12 relative z-50">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Olá, {student?.full_name?.split(" ")[0] || "Aluno"}.
                </h1>
                <p className="text-gray-400">Continue sua jornada para o topo do ranking.</p>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Nível Atual</p>
                    <div className="flex items-center justify-end gap-1 text-yellow-400 font-bold">
                        <Zap size={16} fill="currentColor" /> {student?.points || 0} XP
                    </div>
                </div>
                {/* Menu Suspenso */}
                <UserMenu 
                    session={{ user: { email: student?.email } }} 
                    profile={{ role: 'student', full_name: student?.full_name, avatar_url: student?.avatar_url }} 
                />
            </div>
        </header>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Cursos */}
            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <PlayCircle size={80} />
                </div>
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                    <PlayCircle size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">0/5</h3>
                <p className="text-gray-500 text-sm">Cursos em Andamento</p>
                <div className="w-full bg-white/5 h-1 mt-4 rounded-full">
                    <div className="bg-purple-500 h-full w-[10%]" />
                </div>
            </div>

            {/* Medalhas */}
            <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy size={80} />
                </div>
                <div className="w-10 h-10 bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center mb-4">
                    <Trophy size={20} />
                </div>
                <h3 className="text-2xl font-bold mb-1">0</h3>
                <p className="text-gray-500 text-sm">Medalhas Conquistadas</p>
            </div>

            {/* Card de Ação (Empresas) - Atalho Rápido */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-900/10 border border-purple-500/30 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-2">Conheça as Empresas</h3>
                <p className="text-purple-200 text-xs mb-4">Veja quem está contratando e prepare-se.</p>
                <Link href="/aluno/empresas" className="bg-white text-purple-900 px-4 py-2 rounded-lg font-bold text-sm text-center hover:bg-purple-100 transition-colors">
                    Ver Vitrine de Empresas
                </Link>
            </div>

        </div>

        {/* SEÇÃO DE CURSOS */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-purple-500" /> Meus Cursos
        </h2>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500">
                <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Você ainda não iniciou cursos</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Acesse a área de membros para começar sua jornada de aprendizado.</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Ir para Área de Aulas
            </button>
        </div>

    </div>
  );
}
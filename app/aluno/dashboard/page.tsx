"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, Trophy, Building2, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { fetchStudentProgress } from "@/app/actions/cademi-data";

export default function AlunoDashboard() {
  const [firstName, setFirstName] = useState("Aluno");
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any[]>([]);
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role, email")
          .eq("id", user.id)
          .single();

        if (profile?.role === 'company') {
            router.push('/empresa/dashboard');
            return;
        }

        if (profile?.full_name) {
          setFirstName(profile.full_name.split(" ")[0]);
        }

        if (profile?.email) {
            try {
                const realData = await fetchStudentProgress(profile.email);
                setProgressData(realData);
            } catch (error) {
                console.error("Erro ao buscar Cademi:", error);
            }
        }
      }
      setLoading(false);
    }

    loadData();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><Loader2 className="animate-spin text-purple-600" /></div>;
  }

  const totalPercent = progressData.length > 0 
    ? Math.round(progressData.reduce((acc, curr) => acc + curr.percent, 0) / progressData.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Olá, {firstName}.
          </h1>
          <p className="text-gray-400 mt-1">
            Sua jornada real na VULP.
          </p>
        </div>
        <UserMenu />
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Progresso Geral */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-colors flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 relative z-10">
              <PlayCircle size={32} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500/5 blur-sm scale-[2.5] pointer-events-none">
                <PlayCircle size={32} />
            </div>
          </div>
          <div className="relative z-10 w-full">
            <h3 className="text-3xl font-bold text-white mb-1">{progressData.length}</h3>
            <p className="text-gray-400 text-sm">Cursos Ativos</p>
            {progressData.length > 0 && (
                <>
                    <div className="w-full max-w-[120px] mx-auto bg-white/10 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full transition-all duration-1000" style={{ width: `${totalPercent}%` }} />
                    </div>
                    <p className="text-xs text-purple-400 mt-2 font-bold">{totalPercent}% Concluído Geral</p>
                </>
            )}
          </div>
        </div>

        {/* Card 2: Medalhas */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors flex flex-col items-center text-center">
          <div className="mb-4 relative">
            <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-400 relative z-10">
              <Trophy size={32} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-1">0</h3>
            <p className="text-gray-400 text-sm">Medalhas</p>
          </div>
        </div>

        {/* Card 3: Empresas */}
        <div className="bg-gradient-to-b from-[#130821] to-[#0A0A0A] border border-purple-500/20 p-8 rounded-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="relative z-10 w-full flex flex-col items-center">
             <div className="p-4 bg-white/5 rounded-2xl text-white mb-4">
                <Building2 size={32} />
             </div>
            <h3 className="text-xl font-bold text-white mb-2">Vitrine de Talentos</h3>
            <Link href="/aluno/empresas" className="w-full bg-white text-black font-bold py-3 rounded-xl text-center text-sm hover:bg-gray-200 transition-colors">
              Acessar Vitrine
            </Link>
          </div>
        </div>
      </div>

      {/* SEÇÃO MEUS CURSOS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={20} className="text-purple-400" /> Meus Cursos
        </h2>
        
        {progressData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressData.map((course, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex items-center gap-6 hover:border-purple-500/30 transition-colors group">
                        {/* Círculo de Progresso */}
                        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-purple-600 transition-all duration-1000 ease-out" strokeDasharray={`${course.percent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <span className="absolute text-xs font-bold text-white">{course.percent}%</span>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{course.title}</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                {course.watched} de {course.total} aulas assistidas
                            </p>
                            
                            {/* BOTÃO LINK DIRETO PARA O CURSO */}
                            <a 
                                href={`https://vulpacademy.cademi.com.br/area/produto/${course.id}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                                <PlayCircle size={12} /> Continuar Assistindo
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">Nenhum curso iniciado</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                    Parece que você ainda não começou suas aulas.
                </p>
                <div className="flex justify-center">
                    <a href="https://vulpacademy.cademi.com.br/login" target="_blank" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
                        <PlayCircle size={20} /> Ir para Área de Aulas
                    </a>
                </div>
            </div>
        )}
      </div>

    </div>
  );
}
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Plus, Search, MapPin, Trophy, Loader2, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CompanyDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Métricas
  const [totalStudents, setTotalStudents] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadData() {
        setLoading(true);

        // 1. Buscar Alunos (Ordenados por XP)
        const { data: studentsData, count } = await supabase
            .from("students")
            .select("*", { count: 'exact' })
            .order("points", { ascending: false })
            .limit(3); // Pega só o TOP 3 para o dashboard (o resto vê em "Ver todos")

        // 2. Buscar Total de Alunos na base
        const { count: totalBase } = await supabase
            .from("students")
            .select("*", { count: 'exact', head: true });

        if (studentsData) setStudents(studentsData);
        if (totalBase) setTotalStudents(totalBase || 0);
        
        setLoading(false);
    }

    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel do Recrutador</h1>
               <p className="text-slate-500">Gerencie suas vagas e encontre talentos certificados.</p>
            </div>
            
            <Link href="/empresa/vagas/nova" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-105">
                <Plus size={20} /> Nova Vaga
            </Link>
        </header>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-2">
                    <Briefcase size={20} />
                </div>
                <div>
                    <span className="text-slate-500 text-sm font-medium">Vagas Abertas</span>
                    {/* Nota: Futuramente buscar do banco 'jobs' */}
                    <h2 className="text-3xl font-bold text-slate-900">1</h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-2">
                    <Users size={20} />
                </div>
                <div>
                    <span className="text-slate-500 text-sm font-medium">Candidatos Totais</span>
                    <h2 className="text-3xl font-bold text-slate-900">1</h2>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-2">
                    <Trophy size={20} />
                </div>
                <div>
                    <span className="text-slate-500 text-sm font-medium">Talentos na Base</span>
                    <h2 className="text-3xl font-bold text-slate-900">{totalStudents}</h2>
                </div>
            </div>
        </div>

        {/* BARRA DE BUSCA (Visual apenas por enquanto) */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-center gap-2">
            <Search className="text-slate-400 ml-4" size={20} />
            <input 
                type="text" 
                placeholder="Busque por habilidade (ex: Copywriter, Editor, Tráfego...)" 
                className="flex-1 p-3 text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Buscar
            </button>
        </div>

        {/* LISTA DE TALENTOS (Agora Real!) */}
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-slate-900">Talentos em Destaque</h2>
            <Link href="/empresa/banco-talentos" className="text-purple-600 font-bold text-sm hover:underline">
                Ver todos
            </Link>
        </div>

        {loading ? (
            <div className="w-full h-40 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" />
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-6">
                {students.map((student) => (
                    <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border border-purple-200">
                                    {student.avatar_url ? (
                                        <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        student.full_name?.substring(0, 2).toUpperCase() || "AL"
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 line-clamp-1">{student.full_name || "Usuário Vulp"}</h3>
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <MapPin size={12} /> Brasil
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                {student.bio || "Este talento ainda não adicionou uma bio..."}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="flex items-center gap-1 text-purple-600 font-bold text-xs bg-purple-50 px-2 py-1 rounded-md">
                                <Trophy size={12} /> {student.points || 0} XP
                            </span>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-purple-600 transition-colors">Ver Perfil</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

    </div>
  );
}
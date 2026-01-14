import { supabase } from "@/lib/supabase";
import { Briefcase, LayoutDashboard, LogOut, Plus, Search, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default async function CompanyDashboard() {
  // 1. BUSCAR DADOS REAIS DO BANCO
  // Trazemos os alunos ordenados por Pontos (XP) para destacar os melhores
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order('points', { ascending: false })
    .limit(6); // Traz apenas os top 6 para o resumo inicial

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-8">
            <div className="font-bold text-2xl tracking-tighter text-slate-900">
                VULP<span className="text-purple-600">.</span> <span className="text-xs text-slate-400 font-normal uppercase tracking-widest ml-1">Business</span>
            </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold text-sm transition-colors">
            <LayoutDashboard size={20} /> Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-purple-600 rounded-xl font-medium text-sm transition-colors">
            <Users size={20} /> Banco de Talentos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-purple-600 rounded-xl font-medium text-sm transition-colors">
            <Briefcase size={20} /> Minhas Vagas
          </a>
        </nav>

        <div className="p-8 border-t border-slate-100">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-medium transition-colors">
                <LogOut size={16} /> Sair da conta
            </Link>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel do Recrutador</h1>
                <p className="text-slate-500 mt-2">Gerencie suas vagas e encontre talentos certificados.</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-200 transition-all hover:-translate-y-1">
                <Plus size={18} /> Nova Vaga
            </button>
        </header>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { label: "Vagas Abertas", value: "0", icon: <Briefcase size={24} className="text-purple-600"/> },
                { label: "Candidatos", value: "0", icon: <Users size={24} className="text-purple-600"/> },
                { label: "Talentos na Base", value: students?.length || 0, icon: <Trophy size={24} className="text-purple-600"/> },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl">{stat.icon}</div>
                        <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* Barra de Busca */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-10 flex items-center">
            <div className="p-4 text-slate-400">
                <Search size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Busque por habilidade (ex: Copywriter, Editor, Tráfego...)" 
                className="flex-1 py-3 text-slate-900 placeholder:text-slate-400 outline-none bg-transparent font-medium"
            />
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Buscar
            </button>
        </div>

        {/* Lista de Talentos Reais */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Talentos em Destaque</h2>
            <Link href="/vitrine" className="text-sm font-bold text-purple-600 hover:text-purple-700">Ver todos</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {students && students.length > 0 ? (
              students.map((student) => (
                <Link key={student.id} href={`/talento/${student.id}`}>
                    <div className="h-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all cursor-pointer group flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-slate-100 group-hover:border-purple-100">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    student.full_name.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                                    {student.full_name}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium line-clamp-1">
                                    Talento VULP
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 flex items-center gap-1">
                                <Trophy size={12} /> {student.points} XP
                            </span>
                        </div>
                        
                        <div className="mt-auto">
                            <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                Ver Perfil Completo
                            </button>
                        </div>
                    </div>
                </Link>
              ))
            ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Nenhum talento encontrado no banco de dados.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}
import { supabase } from "@/lib/supabase";
import { Briefcase, LayoutDashboard, LogOut, Plus, Search, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default async function CompanyDashboard() {
  // Nota: Aqui futuramente faremos o fetch real dos alunos
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      
      {/* --- SIDEBAR (Branca com detalhes Roxos) --- */}
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
                { label: "Vagas Abertas", value: "03", icon: <Briefcase size={24} className="text-purple-600"/> },
                { label: "Candidatos", value: "12", icon: <Users size={24} className="text-purple-600"/> },
                { label: "Talentos Salvos", value: "05", icon: <Trophy size={24} className="text-purple-600"/> },
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

        {/* Lista de Talentos (Exemplo Visual) */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Talentos em Destaque</h2>
            <Link href="/vitrine" className="text-sm font-bold text-purple-600 hover:text-purple-700">Ver todos</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Exemplo - Light Mode */}
            {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 font-bold text-xl">
                           {item === 1 ? 'A' : item === 2 ? 'C' : 'B'}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                                {item === 1 ? 'Ana Silva' : item === 2 ? 'Carlos Souza' : 'Beatriz Lima'}
                            </h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {item === 1 ? 'Gestora de Tráfego' : item === 2 ? 'Copywriter' : 'Designer'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100">
                            {item === 1 ? '1500 XP' : '800 XP'}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                            Disponível
                        </span>
                    </div>

                    <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                        Ver Perfil
                    </button>
                </div>
            ))}
        </div>

      </main>
    </div>
  );
}
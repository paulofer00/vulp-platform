"use client";

import React, { useState } from 'react';
import { Play, MessageSquare, Award, User, Search, Bell, Zap, BookOpen, ChevronRight, BarChart3 } from 'lucide-react';

const VulpPlatform = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const colors = {
    bg: "bg-[#050505]",
    card: "bg-[#121212]",
    primary: "bg-purple-700",
    primaryHover: "hover:bg-purple-600",
    textMain: "text-white",
    textSec: "text-gray-400"
  };

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.textMain} font-sans selection:bg-purple-500 selection:text-white flex overflow-hidden`}>
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-gray-800 flex flex-col justify-between p-4 transition-all duration-300">
        <div>
          <div className="mb-12 px-2 flex justify-center lg:justify-start">
             {/* Logo VULP */}
             <img src="/logo-vulp-white.png" alt="VULP" className="h-10 lg:h-14 w-auto object-contain" />
          </div>

          <nav className="space-y-6">
            <NavItem icon={<Zap size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavItem icon={<BookOpen size={20} />} label="Meus Cursos" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
            <NavItem icon={<MessageSquare size={20} />} label="Comunidade" active={activeTab === 'community'} onClick={() => setActiveTab('community')} />
            <NavItem icon={<BarChart3 size={20} />} label="Desempenho" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          </nav>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center border-2 border-black">
            <User size={18} />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-bold">Aluno Vulp</p>
            <p className="text-xs text-purple-400">Plano Pro</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bem-vindo, Empreendedor.</h1>
            <p className="text-gray-400 text-sm">Continue sua jornada rumo ao topo.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar conteúdo..." 
                className="bg-[#1a1a1a] border border-gray-800 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-purple-500 w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            </div>
            <button className="relative p-2 rounded-full hover:bg-white/10 transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="mb-12 relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent rounded-2xl z-10"></div>
          {/* Placeholder image */}
          <div className="w-full h-80 bg-gray-800 rounded-2xl"></div> 
          <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
            <span className="bg-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Novo Módulo</span>
            <h2 className="text-4xl font-black mb-3 leading-tight">Dominando o Branding Digital</h2>
            <p className="text-gray-300 mb-6 line-clamp-2">Aprenda a criar marcas que não apenas vendem, mas criam legados.</p>
            <button className="bg-white text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:bg-gray-200 transition">
              <Play size={18} fill="black" /> Continuar Assistindo
            </button>
          </div>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-bold flex items-center gap-2"><Award className="text-purple-500"/> Trilhas de Conhecimento</h3>
              <a href="#" className="text-sm text-purple-400 hover:text-white transition">Ver tudo</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CourseCard title="Gestão de Tráfego 2.0" progress={75} category="Marketing" imageColor="bg-blue-900"/>
              <CourseCard title="Copywriting Persuasivo" progress={30} category="Vendas" imageColor="bg-indigo-900"/>
              <CourseCard title="Finanças para Startups" progress={0} category="Gestão" imageColor="bg-emerald-900"/>
              <CourseCard title="Liderança Ágil" progress={10} category="Soft Skills" imageColor="bg-orange-900"/>
            </div>
          </div>

          <div className="space-y-8">
            {/* Gamification */}
            <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600 blur-[60px] opacity-40"></div>
               <h3 className="font-bold mb-4 text-lg">Seu Nível VULP</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="text-4xl font-black text-purple-500">07</div>
                 <div>
                   <p className="font-bold">Estrategista Sênior</p>
                   <p className="text-xs text-gray-500">540 XP para o nível 08</p>
                 </div>
               </div>
               <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                 <div className="bg-gradient-to-r from-purple-600 to-white h-2 rounded-full" style={{width: '70%'}}></div>
               </div>
            </div>

            {/* Forum */}
            <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 text-lg flex justify-between">
                Discussões Recentes 
                <ChevronRight size={16} className="text-gray-500"/>
              </h3>
              <div className="space-y-4">
                <ForumItem title="Como escalar meu e-commerce?" author="Beatriz M." time="2 min atrás" />
                <ForumItem title="Dúvida sobre a aula de Branding" author="João P." time="15 min atrás" />
                <ForumItem title="Networking em São Paulo?" author="Carlos D." time="1h atrás" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// TIPAGEM DOS COMPONENTES (A CORREÇÃO ESTÁ AQUI)

interface NavItemProps {
  icon: React.ReactElement; // Define que icon deve ser um elemento React
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-300 group
      ${active ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(108,33,255,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
    `}
  >
    {React.cloneElement(icon, { size: 22 })}
    <span className="hidden lg:block font-medium">{label}</span>
    {active && <span className="ml-auto w-1 h-1 bg-white rounded-full hidden lg:block"></span>}
  </button>
);

interface CourseCardProps {
  title: string;
  progress: number;
  category: string;
  imageColor: string;
}

const CourseCard = ({ title, progress, category, imageColor }: CourseCardProps) => (
  <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
    <div className={`h-32 ${imageColor} relative`}>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs px-2 py-1 rounded text-white font-bold border border-white/10">
        {category}
      </span>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
            <Play fill="white" size={20} />
        </div>
      </div>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-lg mb-3 leading-tight">{title}</h4>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <span>Progresso</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1">
        <div 
          className="bg-purple-500 h-1 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
          style={{width: `${progress}%`}}
        ></div>
      </div>
    </div>
  </div>
);

interface ForumItemProps {
  title: string;
  author: string;
  time: string;
}

const ForumItem = ({ title, author, time }: ForumItemProps) => (
  <div className="flex items-start gap-3 border-b border-gray-800 pb-3 last:border-0 last:pb-0">
    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
      {author.charAt(0)}
    </div>
    <div>
      <p className="text-sm font-medium hover:text-purple-400 cursor-pointer transition">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-500">{author}</span>
        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
        <span className="text-xs text-gray-600">{time}</span>
      </div>
    </div>
  </div>
);

export default VulpPlatform;
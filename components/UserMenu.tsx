"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
// 👇 O IMPORT DA AÇÃO QUE CRIAMOS
import { signOut } from "@/app/actions/auth"; 

interface UserMenuProps {
  session: any;
  profile: any;
}

export default function UserMenu({ session, profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Define para onde o botão "Meu Painel" leva
  const dashboardLink = profile?.role === 'company' ? "/empresa/dashboard"
                      : profile?.role === 'admin' ? "/admin"
                      : "/aluno/dashboard";
  
  // Define link de perfil
  const profileLink = profile?.role === 'company' ? "/empresa/perfil" : "/aluno/perfil";

  return (
    <div className="relative" ref={menuRef}>
        
        {/* BOTÃO QUE ABRE O MENU (Trigger) */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-1 pr-4 py-1 transition-all group"
        >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white overflow-hidden border border-purple-500/50">
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{profile?.full_name?.[0]?.toUpperCase() || "U"}</span>
                )}
            </div>
            <span className="text-sm font-medium text-white hidden md:block group-hover:text-purple-200 transition-colors">
                {profile?.full_name?.split(" ")[0] || "Usuário"}
            </span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* O MENU SUSPENSO (Dropdown) */}
        {isOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-2xl shadow-black/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">

                <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Logado como</p>
                    <p className="text-sm text-white font-medium truncate" title={session.user.email}>
                        {session.user.email}
                    </p>
                </div>

                <div className="p-1">
                    <Link 
                        href={dashboardLink}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <LayoutDashboard size={16} className="text-purple-500" /> Meu Painel
                    </Link>

                    <Link 
                        href={profileLink}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <User size={16} className="text-blue-500" /> Ver Perfil
                    </Link>
                </div>

                <div className="p-1 border-t border-white/5">
                    {/* 👇 AQUI ESTÁ A CORREÇÃO DO LOGOUT 👇 */}
                    <form action={signOut}>
                        <button 
                            type="submit" 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                        >
                            <LogOut size={16} /> Sair da Conta
                        </button>
                    </form>
                </div>

            </div>
        )}
    </div>
  );
}
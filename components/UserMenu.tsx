"use client";

import { createBrowserClient } from "@supabase/ssr";
import { LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function UserMenu({ session, profile }: { session: any, profile: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh(); // Atualiza a página para mostrar o botão "Entrar" de novo
    setIsOpen(false);
  }

  // Define para onde vai o botão "Meu Painel" baseado no cargo
  const role = profile?.role || "student";
  const dashboardLink = role === "admin" ? "/admin" : role === "company" ? "/empresa/dashboard" : "/aluno/dashboard";
  
  const name = profile?.full_name || session.user.email?.split("@")[0] || "Usuário";
  const avatar = profile?.avatar_url;

  return (
    <div className="relative" ref={menuRef}>
      
      {/* Botão Principal (Foto + Nome) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 py-1 pl-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden border border-white/10">
            {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
                name.charAt(0)
            )}
        </div>
        <span className="text-sm font-medium text-gray-300 group-hover:text-white max-w-[100px] truncate hidden md:block">
            {name}
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F0F0F] border border-white/20 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/5">
            
            <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Logado como</p>
                <p className="text-sm text-white font-medium truncate">{session.user.email}</p>
            </div>

            <div className="p-1">
                <Link 
                    href={dashboardLink} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                >
                    <LayoutDashboard size={16} className="text-purple-500" /> Meu Painel
                </Link>
                
                {/* Se for Aluno, mostra link pro perfil público */}
                {role === 'student' && (
                    <Link 
                        href={`/talento/${session.user.id}`} 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                    >
                        <User size={16} className="text-blue-500" /> Ver Perfil Público
                    </Link>
                )}
            </div>

            <div className="p-1 border-t border-white/5">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                    <LogOut size={16} /> Sair da Conta
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
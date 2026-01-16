"use client";

import { createBrowserClient } from "@supabase/ssr";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [initials, setInitials] = useState("U");
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getUserData() {
      // 1. Pega o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");

        // 2. Busca o NOME REAL na tabela de perfis
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setName(profile.full_name);
          
          // Cria as iniciais (Ex: Paulo Fernandes -> PF)
          const names = profile.full_name.split(" ");
          const firstInitial = names[0][0];
          const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";
          setInitials((firstInitial + lastInitial).toUpperCase());
          
          setRole(profile.role);
        } else {
          // Fallback se não achar o perfil
          setName(user.email?.split("@")[0] || "Usuário");
          setInitials(user.email?.[0].toUpperCase() || "U");
        }
      }
    }

    getUserData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  // Se não tiver nome carregado ainda, mostra um esqueleto simples
  if (!email) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-full pr-4 transition-colors border border-transparent hover:border-white/10"
      >
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/20">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-white leading-none">
            {name}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            {role === 'company' ? 'Empresa' : 'Aluno'}
          </p>
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-56 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-white/5 mb-2">
              <p className="text-xs text-gray-500 uppercase font-bold">Logado como</p>
              <p className="text-sm text-white truncate" title={email}>{email}</p>
            </div>

            <Link 
              href={role === 'company' ? "/empresa/dashboard" : "/aluno/dashboard"} 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={16} /> Meu Painel
            </Link>

            <Link 
              href={role === 'company' ? "/empresa/perfil" : "/aluno/perfil"} 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} /> Editar Perfil
            </Link>

            <div className="h-px bg-white/5 my-2" />

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} /> Sair da Conta
            </button>
          </div>
        </>
      )}
    </div>
  );
}
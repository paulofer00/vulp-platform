import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, Building2, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth"; // <--- ADICIONE ISSO NO TOPO

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR FIXA */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-8">
             {/* CORREÇÃO AQUI: Trocamos o texto pela imagem */}
             <Link href="/empresa/dashboard" className="cursor-pointer block">
                <img src="/logo-dark.png" alt="VULP Business" className="h-8 w-auto" />
             </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            {/* ... (os links continuam iguais) ... */}
            <Link href="/empresa/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <LayoutDashboard size={20} /> Visão Geral
            </Link>
            <Link href="/empresa/banco-talentos" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Users size={20} /> Banco de Talentos
            </Link>
            <Link href="/empresa/vagas" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Briefcase size={20} /> Minhas Vagas
            </Link>
            <Link href="/empresa/perfil" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors font-medium">
                <Building2 size={20} /> Meu Perfil
            </Link>
        </nav>
        {/* ... rodapé do sidebar ... */}


        <div className="p-4 mt-auto border-t border-slate-100">
            {/* O Link virou um Form com Button */}
            <form action={signOut}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors font-medium text-sm">
                    <LogOut size={18} /> Sair da conta
                </button>
            </form>
        </div>
      </aside>

      {/* CONTEÚDO DAS PÁGINAS (Dashboard, Perfil, Vagas...) */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>

    </div>
  );
}
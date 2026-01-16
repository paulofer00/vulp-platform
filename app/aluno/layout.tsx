import Link from "next/link";
import { LayoutDashboard, User, Briefcase, Building2, BookOpen, Trophy, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth"; // <--- ADICIONE ISSO NO TOPO

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] flex font-sans text-white">
      
      {/* SIDEBAR FIXA */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-white/10 fixed h-full z-20 hidden md:flex flex-col">
        <div className="p-8">
             <Link href="/aluno/dashboard" className="cursor-pointer block">
                <img src="/logo-white.png" alt="VULP" className="h-6 w-auto" />
             </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
            <Link href="/aluno/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <LayoutDashboard size={20} /> Dashboard
            </Link>
            
            <Link href="/aluno/perfil" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <User size={20} /> Editar Perfil
            </Link>

            <Link href="/aluno/vagas" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <Briefcase size={20} /> Mercado de Vagas
            </Link>

            {/* 👇 NOVO BOTÃO DE EMPRESAS AQUI 👇 */}
            <Link href="/aluno/empresas" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <Building2 size={20} /> Empresas
            </Link>

            <Link href="/aluno/cursos" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <BookOpen size={20} /> Meus Cursos
            </Link>

            <Link href="/aluno/conquistas" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-purple-600/10 hover:text-purple-400 rounded-xl transition-colors font-medium">
                <Trophy size={20} /> Conquistas
            </Link>
        </nav>

        // ... (resto do código do layout)

        <div className="p-4 mt-auto border-t border-white/10">
            <form action={signOut}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors font-medium text-sm">
                    <LogOut size={18} /> Sair da conta
                </button>
            </form>
        </div>
      </aside>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="flex-1 md:ml-64">
        {children}
      </main>

    </div>
  );
}
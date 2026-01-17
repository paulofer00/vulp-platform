import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BadgeCheck, Trophy, User } from "lucide-react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu"; // <--- Importamos o Menu Inteligente

export default async function VitrinePage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 1. Verifica se tem alguém logado (Sessão)
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Busca os alunos
  const { data: students } = await supabase
    .from("profiles") // OBS: Certifique-se que seus alunos estão na tabela 'profiles' com role='student'
    .select("*")
    .eq('role', 'student') // Filtra apenas alunos
    // .order('points', { ascending: false }); // Descomente se tiver coluna 'points' na profiles
    
  // Se ainda estiver usando a tabela 'students' separada, mantenha: .from("students").select("*")

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR INTELIGENTE */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo-white.svg" alt="VULP" className="h-8 w-auto" />
          </Link>

          <div className="flex gap-4 items-center">
             {session ? (
                // SE LOGADO: Mostra o Menu do Usuário (Foto, Painel, Sair)
                <UserMenu />
             ) : (
                // SE NÃO LOGADO: Mostra os botões de entrar
                <>
                    <Link href="/login" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors font-bold text-sm">
                        Sou Empresa
                    </Link>
                    <Link href="/login" className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors font-bold text-sm shadow-lg shadow-purple-900/20">
                        Sou Aluno
                    </Link>
                </>
             )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                Contrate os <span className="text-purple-500">Melhores</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10">
                Acesse nossa base exclusiva de alunos certificados.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {students && students.length > 0 ? (
                students.map((student) => (
                    <div key={student.id} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all group flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-white/5 flex items-center justify-center text-purple-400 font-bold text-2xl overflow-hidden">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    (student.full_name || "U").charAt(0)
                                )}
                            </div>
                            {/* Exemplo de XP fake caso não tenha no banco ainda */}
                            <div className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 flex items-center gap-1">
                                <Trophy size={12} /> {student.points || 0} XP
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors flex items-center gap-2">
                                {student.full_name || "Aluno VULP"} <BadgeCheck size={16} className="text-blue-500/50" /> 
                            </h3>
                            <p className="text-sm text-purple-300 font-medium">Talento VULP</p>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                            {student.bio || "Biografia em construção..."}
                        </p>
                        <div className="mt-auto flex gap-3">
                             <Link href={`/talento/${student.id}`} className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-center text-sm font-bold transition-colors shadow-lg shadow-purple-900/20">
                                Ver Perfil
                             </Link>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                    <User size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">Nenhum talento encontrado no Banco de Dados.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
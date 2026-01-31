import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BadgeCheck, Trophy, User, Zap } from "lucide-react";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { getAlunoPublico } from "@/lib/cademi"; // <--- Importamos a função nova

export default async function VitrinePage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 1. Verifica sessão
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Busca os alunos no Supabase
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq('role', 'student');

  // 3. ENRIQUECIMENTO DE DADOS (Busca os pontos na Cademi para cada aluno)
  // Usamos Promise.all para buscar todos ao mesmo tempo (mais rápido)
  const studentsWithPoints = await Promise.all(
    (profiles || []).map(async (student) => {
      // Se o aluno tiver email, busca na Cademi
      let pontos = 0;
      if (student.email) {
        const cademiData = await getAlunoPublico(student.email);
        if (cademiData) {
            pontos = cademiData.pontos;
        }
      }
      // Retorna o aluno do Supabase somado com os pontos da Cademi
      return { ...student, pontosReais: pontos };
    })
  );

  // 4. Ordena pelo ranking (Maior pontuação primeiro)
  const sortedStudents = studentsWithPoints.sort((a, b) => b.pontosReais - a.pontosReais);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
          </Link>

          <div className="flex gap-4 items-center">
             {session ? (
                <UserMenu />
             ) : (
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
                Ranking atualizado em tempo real baseado na performance prática.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedStudents.length > 0 ? (
                sortedStudents.map((student, index) => (
                    <div key={student.id} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all group flex flex-col relative overflow-hidden">
                        
                        {/* Destaque para o TOP 3 */}
                        {index < 3 && (
                            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-yellow-500/20">
                                TOP {index + 1}
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-full bg-purple-900/20 border border-white/5 flex items-center justify-center text-purple-400 font-bold text-2xl overflow-hidden">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    (student.full_name || "U").charAt(0)
                                )}
                            </div>
                            
                            {/* PONTUAÇÃO REAL DA CADEMI */}
                            <div className="flex flex-col items-end">
                                <div className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-bold rounded-full border border-purple-500/20 flex items-center gap-1.5">
                                    <Zap size={14} fill="currentColor" /> {student.pontosReais} XP
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Performance</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors flex items-center gap-2">
                                {student.full_name || "Aluno VULP"} 
                                {student.pontosReais > 100 && <BadgeCheck size={16} className="text-blue-500" />}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium">{student.bio ? "Talento Verificado" : "Novo Talento"}</p>
                        </div>
                        
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                            {student.bio || "Este aluno está focado em construir resultados práticos na plataforma."}
                        </p>

                        <div className="mt-auto flex gap-3">
                             <Link href={`/talento/${student.id}`} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white text-center text-sm font-bold transition-all">
                                Ver Perfil Completo
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
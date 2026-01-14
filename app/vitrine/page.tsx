import { supabase } from "@/lib/supabase";
import { Search, Trophy, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";

// Essa função roda no SERVIDOR antes da página abrir (Super rápido)
async function getStudents() {
  const { data: students } = await supabase
    .from("students")
    .select(`
      *,
      student_medals (
        medals (
          name,
          image_url
        )
      )
    `)
    .order('points', { ascending: false }); // Os melhores alunos primeiro

  return students || [];
}

export default async function VitrinePage() {
  const students = await getStudents();

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20">
      
      {/* --- HEADER / HERO --- */}
      <header className="relative py-20 px-6 text-center overflow-hidden border-b border-white/5">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest">
            <Trophy size={14} /> Talentos Verificados
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Contrate os <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500">Melhores</span>
          </h1>
          
          <p className="text-gray-400 text-lg">
            Acesse nossa base exclusiva de alunos certificados e encontre o profissional ideal para escalar seu negócio.
          </p>

          {/* Barra de Pesquisa Fictícia (Visual) */}
          <div className="relative max-w-md mx-auto mt-8">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por habilidade (ex: Copywriter)..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>
      </header>

      {/* --- GRID DE ALUNOS --- */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {students.map((student: any) => (
            <div key={student.id} className="group relative bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)]">
              
              {/* Pontuação (Ranking) */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md">
                <Trophy size={12} className="text-yellow-500" />
                {student.points} XP
              </div>

              {/* Cabeçalho do Card */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xl font-bold text-purple-400 overflow-hidden">
                   {/* Se tiver avatar usa imagem, senão usa a inicial */}
                   {student.avatar_url ? (
                     <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                   ) : (
                     student.full_name.charAt(0)
                   )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {student.full_name}
                  </h3>
                  <span className="text-sm text-gray-500">Aluno VULP</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-400 text-sm line-clamp-3 mb-6 h-14">
                {student.bio || "Aluno focado em desenvolvimento profissional."}
              </p>

              {/* Medalhas (Tags) */}
              <div className="flex flex-wrap gap-2 mb-6">
                {student.student_medals && student.student_medals.length > 0 ? (
                  student.student_medals.map((sm: any) => (
                    <span key={sm.medals.name} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-purple-900/30 text-purple-300 border border-purple-500/20">
                       {/* Se quiser mostrar icone da medalha: <img src={sm.medals.image_url} className="w-3 h-3" /> */}
                       {sm.medals.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-gray-600 italic">Iniciante</span>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <Link 
                  href={student.portfolio_link || "#"} 
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors"
                >
                  <ExternalLink size={14} /> Portfólio
                </Link>
                <Link 
  href={`/talento/${student.id}`} 
  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors"
>
  Ver Perfil Completo
</Link>
              </div>

            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
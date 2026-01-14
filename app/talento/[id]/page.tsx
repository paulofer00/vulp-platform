import { supabase } from "@/lib/supabase";
import { ArrowLeft, MessageCircle, Share2, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// TELA DE DETALHES DO ALUNO
export default async function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  // Em Next.js novos, params é uma Promise
  const { id } = await params;

  // 1. Buscar dados do aluno e suas medalhas
  const { data: student } = await supabase
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
    .eq("id", id)
    .single();

  if (!student) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-20 px-6 relative overflow-hidden">
      
      {/* Botão Voltar */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/vitrine" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Voltar para Vitrine
        </Link>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Cartão de Perfil Principal */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 text-center md:text-left">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/20 p-1">
             <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden">
               {student.avatar_url ? (
                  <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600 bg-gray-900">
                    {student.full_name.charAt(0)}
                  </div>
               )}
             </div>
          </div>
          
          <div className="flex-1">
             <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 flex items-center gap-1">
                  <Trophy size={12} /> {student.points} XP
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                  Aluno Verificado
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">{student.full_name}</h1>
             <p className="text-gray-400 text-lg leading-relaxed">{student.bio || "Sem biografia cadastrada."}</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Link 
            href={`https://wa.me/${student.whatsapp}?text=Olá, vi seu perfil na VULP.`}
            target="_blank"
            className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02]"
          >
            <MessageCircle /> Chamar no WhatsApp
          </Link>
          <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all border border-white/5">
            <Share2 /> Compartilhar Perfil
          </button>
        </div>

        {/* Seção de Conquistas */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Conquistas & Certificados</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {student.student_medals && student.student_medals.length > 0 ? (
              student.student_medals.map((sm: any) => (
                <div key={sm.medals.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
                    <Trophy size={18} />
                  </div>
                  <span className="font-medium text-gray-200">{sm.medals.name}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm italic">Este aluno ainda está iniciando sua jornada.</p>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { BadgeCheck, Briefcase, Github, Globe, Linkedin, Mail, MapPin, Share2, Star, Trophy, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublicProfile({ params }: { params: { id: string } }) {
  // 1. Setup do Supabase (Apenas leitura aqui)
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 2. Buscar dados do aluno pelo ID da URL
  const { data: student } = await supabase
    .from("students")
    .select("*, student_medals(*)")
    .eq("id", params.id)
    .single();

  // Se não achar o aluno, manda para página 404
  if (!student) {
    notFound();
  }

  // Dados visuais (Fallback se não tiver preenchido)
  const avatar = student.avatar_url;
  const initial = student.full_name.charAt(0);
  const bio = student.bio || "Este talento ainda não adicionou uma biografia.";
  const role = "Especialista Digital"; // Poderia vir do banco também
  const xp = student.points || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR SIMPLES */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tighter">VULP<span className="text-purple-600">.</span></Link>
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
            Entrar na Plataforma
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER DO PERFIL */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          
          {/* Avatar Gigante com Brilho */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 blur-[40px] opacity-50 group-hover:opacity-75 transition-opacity rounded-full"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#111] border-4 border-[#1a1a1a] flex items-center justify-center overflow-hidden">
                {avatar ? (
                    <img src={avatar} alt={student.full_name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-5xl font-bold text-gray-700">{initial}</span>
                )}
            </div>
            <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-[#050505]" title="Disponível para contratação"></div>
          </div>

          {/* Infos Principais */}
          <div className="flex-1 space-y-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{student.full_name}</h1>
                    <BadgeCheck className="text-blue-500 fill-blue-500/10" size={28} />
                </div>
                <p className="text-xl text-purple-400 font-medium">{role}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2"><MapPin size={16}/> Brasil (Remoto)</span>
                <span className="flex items-center gap-2 text-yellow-500"><Star size={16} fill="currentColor"/> Top 5% da Turma</span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Mail size={18} /> Contratar Agora
                </button>
                <button className="bg-white/5 text-white px-4 py-3 rounded-full font-bold hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2">
                    <Share2 size={18} /> Compartilhar
                </button>
            </div>
          </div>

          {/* Card de Nível */}
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl min-w-[200px] text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Nível VULP</p>
            <div className="text-4xl font-bold text-white mb-1">{xp} <span className="text-lg text-purple-500">XP</span></div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-purple-600 w-[60%]"></div>
            </div>
          </div>
        </div>

        {/* GRID DE INFORMAÇÕES */}
        <div className="grid md:grid-cols-3 gap-8">
            
            {/* Coluna da Esquerda (Bio e Skills) */}
            <div className="md:col-span-2 space-y-8">
                <section className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="text-purple-500" /> Sobre
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        {bio}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Medalhas e Certificações
                    </h2>
                    
                    {student.student_medals && student.student_medals.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {/* Aqui mapearíamos as medalhas reais */}
                            <div className="p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-purple-500/50 transition-colors">
                                <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center text-purple-400">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Early Adopter</div>
                                    <div className="text-xs text-gray-500">Pioneiro VULP</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 bg-[#0A0A0A] border border-dashed border-white/10 rounded-2xl text-center text-gray-500">
                            Este aluno ainda não conquistou medalhas visíveis.
                        </div>
                    )}
                </section>
            </div>

            {/* Coluna da Direita (Contatos e Portfólio) */}
            <div className="space-y-6">
                <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 text-gray-200">Links e Portfólio</h3>
                    <div className="space-y-3">
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                            <Linkedin size={20} /> Linkedin
                        </a>
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                            <Github size={20} /> GitHub / Behance
                        </a>
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white">
                            <Globe size={20} /> Site Pessoal
                        </a>
                    </div>
                </div>

                <div className="bg-gradient-to-b from-purple-900/20 to-[#0A0A0A] border border-purple-500/20 p-6 rounded-2xl">
                    <h3 className="font-bold mb-2 text-white">Quer contratar?</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Entre em contato diretamente com {student.full_name.split(' ')[0]} através da plataforma VULP.
                    </p>
                    <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm transition-colors">
                        Enviar Mensagem
                    </button>
                </div>
            </div>

        </div>

      </main>
    </div>
  );
}
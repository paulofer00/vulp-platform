"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Briefcase, CheckCircle2, DollarSign, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {
  const { id } = useParams(); // Pega o ID da URL
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    async function loadJob() {
      // 1. Pegar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      // 2. Carregar dados da Vaga
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
        
      setJob(jobData);

      // 3. Verificar se já se candidatou antes
      const { data: application } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", id)
        .eq("student_id", user.id)
        .single();

      if (application) setAlreadyApplied(true);
      setLoading(false);
    }

    if (id) loadJob();
  }, [id, supabase, router]);

  async function handleApply() {
    setApplying(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    // Salvar candidatura no banco
    const { error } = await supabase
        .from("applications")
        .insert({
            job_id: id,
            student_id: user.id
        });

    if (error) {
        alert("Erro ao se candidatar.");
    } else {
        setAlreadyApplied(true);
        // Efeito de confete ou sucesso poderia entrar aqui
    }
    setApplying(false);
  }

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Carregando vaga...</div>;
  if (!job) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Vaga não encontrada.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Voltar */}
        <Link href="/aluno/vagas" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} /> Voltar para o Mural
        </Link>

        {/* Cabeçalho da Vaga */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-purple-300 mb-6 uppercase tracking-wider">
                    <Briefcase size={12} /> Oportunidade
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{job.title}</h1>
                
                <div className="flex flex-wrap gap-6 text-gray-400 font-medium">
                    <span className="flex items-center gap-2"><DollarSign size={18} className="text-green-500"/> {job.salary_range}</span>
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-blue-500"/> {job.location}</span>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Coluna da Esquerda: Descrição */}
            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4 text-white">Sobre a Vaga</h2>
                    <div className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4 text-white">Requisitos</h2>
                    <div className="text-gray-400 leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
                        {job.requirements || "Nenhum requisito específico listado."}
                    </div>
                </section>
            </div>

            {/* Coluna da Direita: Ação */}
            <div className="md:col-span-1">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-2">Interessado?</h3>
                    <p className="text-gray-500 text-sm mb-6">Candidate-se e seu perfil será enviado diretamente para o recrutador.</p>
                    
                    {alreadyApplied ? (
                        <div className="w-full py-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 size={20} /> Candidatura Enviada
                        </div>
                    ) : (
                        <button 
                            onClick={handleApply}
                            disabled={applying}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {applying ? "Enviando..." : <><Send size={18} /> Quero me Candidatar</>}
                        </button>
                    )}
                    
                    <p className="text-xs text-center text-gray-600 mt-4">
                        Ao se candidatar, você compartilha seu perfil VULP com a empresa.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
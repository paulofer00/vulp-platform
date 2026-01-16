"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Calendar, MapPin, User, Trophy, Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobCandidatesPage() {
  const params = useParams(); // Pega o ID da URL
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      // 1. Busca detalhes da Vaga
      const { data: jobData } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      
      setJob(jobData);

      // 2. Busca os Candidatos (Join com a tabela students)
      // O select busca tudo da application e os dados do aluno conectado
      const { data: appsData, error } = await supabase
        .from("applications")
        .select("*, student:students(*)") 
        .eq("job_id", jobId)
        .order("created_at", { ascending: false });

      if (appsData) {
        // Mapeia para pegar apenas os dados do aluno limpos
        setCandidates(appsData.map(app => ({
            ...app.student,
            application_date: app.created_at // Guarda a data da aplicação
        })));
      }
      
      setLoading(false);
    }

    if (jobId) fetchData();
  }, [jobId]);

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-purple-600"/></div>;

  return (
    <div className="max-w-5xl mx-auto">
        
        {/* Header da Vaga */}
        <div className="mb-8">
            <Link href="/empresa/vagas" className="text-sm text-slate-500 hover:text-purple-600 flex items-center gap-2 mb-4 font-medium transition-colors">
                <ArrowLeft size={16} /> Voltar para Minhas Vagas
            </Link>
            
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{job?.title || "Carregando..."}</h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job?.location || "Remoto"}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> Publicada em {new Date(job?.created_at).toLocaleDateString('pt-BR')}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">Ativa</span>
                    </div>
                </div>
                {/* Contador */}
                <div className="bg-purple-50 px-6 py-4 rounded-2xl text-center border border-purple-100">
                    <span className="block text-3xl font-bold text-purple-600">{candidates.length}</span>
                    <span className="text-xs font-bold text-purple-400 uppercase">Candidatos</span>
                </div>
            </div>
        </div>

        {/* Lista de Candidatos */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Lista de Inscritos</h2>

        {candidates.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <User size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Nenhum candidato ainda</h3>
                <p className="text-slate-500">Compartilhe sua vaga para atrair talentos.</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {candidates.map((student) => (
                    <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all flex flex-col md:flex-row items-center gap-6 group">
                        
                        {/* Avatar e Infos Principais */}
                        <div className="flex items-center gap-4 flex-1 w-full">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-400 font-bold text-lg">{student.full_name?.[0]}</span>
                                )}
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-purple-600 transition-colors">
                                    {student.full_name || "Aluno sem nome"}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <span className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded">
                                        <Trophy size={12} /> {student.points || 0} XP
                                    </span>
                                    <span>Aplicou em: {new Date(student.application_date).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <a 
                                href={`mailto:${student.email}`} // Atalho simples para contato
                                className="flex-1 md:flex-none py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold text-center transition-colors"
                            >
                                Enviar E-mail
                            </a>
                            <button className="flex-1 md:flex-none py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-600/20 transition-all">
                                Ver Perfil Completo
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
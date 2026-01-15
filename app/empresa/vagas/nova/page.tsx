"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Briefcase, DollarSign, MapPin, Plus, Save, AlignLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewJobPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    salary_range: "",
    location: "Remoto",
    description: "",
    requirements: ""
  });

  async function handleCreateJob(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // 1. Pegar usuário atual
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Sessão expirada. Faça login novamente.");
        return router.push("/login");
    }

    // 2. Salvar no Banco
    const { error } = await supabase
        .from("jobs")
        .insert({
            company_id: user.id,
            title: formData.title,
            description: formData.description,
            requirements: formData.requirements,
            salary_range: formData.salary_range,
            location: formData.location,
            status: "open"
        });

    if (error) {
        console.error(error);
        alert("Erro ao criar vaga!");
    } else {
        alert("Vaga publicada com sucesso!");
        router.push("/empresa/dashboard");
        router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/empresa/dashboard" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nova Oportunidade</h1>
            <p className="text-slate-500">Descreva a vaga para atrair os melhores talentos da VULP.</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleCreateJob} className="space-y-6">
            
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Briefcase size={16} className="text-purple-600"/> Título da Vaga
              </label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors font-medium"
                placeholder="Ex: Copywriter Senior para Lançamentos"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Salário */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600"/> Faixa Salarial
                    </label>
                    <input 
                        type="text" 
                        value={formData.salary_range}
                        onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Ex: R$ 2.500 - R$ 4.000"
                    />
                </div>

                {/* Localização */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600"/> Modelo de Trabalho
                    </label>
                    <select 
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="Remoto">100% Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Presencial">Presencial</option>
                    </select>
                </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <AlignLeft size={16} className="text-slate-400"/> Descrição da Função
              </label>
              <textarea 
                rows={5}
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="O que o talento vai fazer no dia a dia?"
              />
            </div>

            {/* Requisitos */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-slate-400"/> Requisitos / Diferenciais
              </label>
              <textarea 
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Ex: Domínio de Adobe Premiere, Inglês básico..."
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-200 hover:-translate-y-1"
              >
                {loading ? "Publicando..." : <><Plus size={20} /> Publicar Vaga</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
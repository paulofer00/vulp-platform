"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Save, User, MapPin, Linkedin, Globe, Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Dados do Formulário
  const [formData, setFormData] = useState({
    full_name: "",
    location: "",
    bio: "",
    linkedin_url: "",
    portfolio_url: ""
  });

  // 1. Carregar dados atuais ao abrir a página
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: student } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.id)
        .single();

      if (student) {
        setFormData({
          full_name: student.full_name || "",
          location: student.location || "",
          bio: student.bio || "",
          linkedin_url: student.linkedin_url || "",
          portfolio_url: student.portfolio_url || ""
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  // 2. Salvar Alterações
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("students")
        .update({
          full_name: formData.full_name,
          location: formData.location,
          bio: formData.bio,
          linkedin_url: formData.linkedin_url,
          portfolio_url: formData.portfolio_url
        })
        .eq("id", user.id);

      if (error) {
        alert("Erro ao salvar!");
        console.error(error);
      } else {
        alert("Perfil atualizado com sucesso!");
        router.push("/aluno/dashboard"); // Volta para o dashboard
        router.refresh();
      }
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-purple-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12">
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/aluno/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Editar Perfil</h1>
        </div>

        {/* Formulário */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Nome Completo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <User size={16} /> Nome Completo
              </label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Seu nome"
              />
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <MapPin size={16} /> Localização
              </label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Ex: São Paulo, Brasil"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                <LayoutDashboard size={16} /> Sobre Você (Bio)
              </label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Conte um pouco sobre suas habilidades e objetivos..."
              />
              <p className="text-xs text-gray-600 text-right">Essa informação aparecerá na vitrine.</p>
            </div>

            <div className="border-t border-white/10 my-6"></div>

            {/* Links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <Linkedin size={16} /> LinkedIn (URL)
                </label>
                <input 
                  type="url" 
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 flex items-center gap-2">
                  <Globe size={16} /> Portfólio / Site (URL)
                </label>
                <input 
                  type="url" 
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  placeholder="https://meusite.com"
                />
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salvar Alterações</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
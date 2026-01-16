"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Building2, Globe, Image as ImageIcon, Loader2, Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function CompanyProfileEdit() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Dados do Formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Busca dados existentes
    const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("id", user.id)
        .single();

    if (data) {
        setName(data.name || "");
        setDescription(data.description || "");
        setWebsite(data.website || "");
        setIndustry(data.industry || "");
        setLogoUrl(data.logo_url || "");
    } else {
        // Se não tiver na tabela companies, tenta pegar o nome do cadastro inicial
        setName(user.user_metadata?.full_name || "");
    }
    setLoading(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !userId) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setSaving(true);
    
    // Upload para o bucket 'logos'
    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

    if (uploadError) {
        alert("Erro ao subir logo: " + uploadError.message);
    } else {
        // Pega a URL pública
        const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
        setLogoUrl(publicUrl);
    }
    setSaving(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const updates = {
        id: userId,
        name,
        description,
        website,
        industry,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from("companies")
        .upsert(updates);

    if (error) {
        alert("Erro ao salvar: " + error.message);
    } else {
        alert("Perfil atualizado com sucesso!");
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-purple-600"/></div>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Perfil da Empresa</h1>
        <p className="text-slate-500 mb-8">Essas informações serão exibidas para os alunos na vitrine.</p>

        <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* LOGO */}
            <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative bg-slate-50 group">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-slate-400" />
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold pointer-events-none">
                        Alterar
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Logo da Empresa</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-3">Recomendado: 500x500px (PNG ou JPG).</p>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 transition-colors">
                        <Upload size={14} /> Selecionar Arquivo
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nome Fantasia</label>
                    <input 
                        value={name} onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-purple-500 focus:outline-none" 
                        placeholder="Ex: Vulp Tecnologia"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Setor / Indústria</label>
                    <input 
                        value={industry} onChange={e => setIndustry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-purple-500 focus:outline-none" 
                        placeholder="Ex: Marketing Digital"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Sobre a Empresa (Bio)</label>
                <textarea 
                    value={description} onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-purple-500 focus:outline-none resize-none" 
                    placeholder="Descreva a cultura da empresa, o que fazem e o que buscam..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Site Oficial</label>
                <div className="relative">
                    <Globe size={18} className="absolute left-3 top-3.5 text-slate-400" />
                    <input 
                        value={website} onChange={e => setWebsite(e.target.value)}
                        className="w-full pl-10 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-purple-500 focus:outline-none" 
                        placeholder="https://suaempresa.com"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={saving} 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20"
            >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
            </button>

        </form>
    </div>
  );
}
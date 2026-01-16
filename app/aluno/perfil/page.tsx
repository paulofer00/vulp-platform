"use client";

import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Camera, Loader2, Save, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentProfile() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    bio: "",
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    avatar_url: ""
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // CORREÇÃO: Buscando da tabela 'profiles' em vez de 'students'
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
            id: profile.id,
            full_name: profile.full_name || "",
            email: profile.email || user.email || "",
            bio: profile.bio || "",
            location: profile.location || "",
            linkedin_url: profile.linkedin_url || "",
            portfolio_url: profile.portfolio_url || "",
            avatar_url: profile.avatar_url || ""
        });
      }
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  // Função de Upload de Imagem
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${formData.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // 1. Sobe o arquivo para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Pega a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Atualiza o estado visual imediatamente
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao subir imagem. Verifique se o bucket "avatars" existe e é público.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    // CORREÇÃO: Salvando na tabela 'profiles'
    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: formData.full_name,
            bio: formData.bio,
            location: formData.location,
            linkedin_url: formData.linkedin_url,
            portfolio_url: formData.portfolio_url,
            avatar_url: formData.avatar_url,
            updated_at: new Date().toISOString()
        })
        .eq("id", formData.id);

    if (error) {
        alert("Erro ao salvar perfil: " + error.message);
        console.error(error);
    } else {
        alert("Perfil atualizado com sucesso!");
        router.refresh(); // Atualiza os dados na tela
    }
    setSaving(false);
  }

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/aluno/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-xl">
          
          {/* Área de Upload de Foto */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-white/5 flex items-center justify-center relative shadow-2xl">
                    {uploading ? (
                        <Loader2 className="animate-spin text-purple-500" size={32} />
                    ) : formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <User size={48} className="text-white/20" />
                    )}
                    
                    {/* Camada interativa */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera size={24} className="text-white" />
                    </div>
                </div>

                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Alterar foto de perfil"
                />
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1 font-medium">
                {uploading ? "Enviando..." : "Clique na foto para alterar"}
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nome Completo</label>
              <input 
                type="text" 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Localização</label>
                    <input 
                        type="text" 
                        placeholder="Ex: São Paulo, SP"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">LinkedIn (URL)</label>
                    <input 
                        type="url" 
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedin_url}
                        onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mini Bio</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Link do Portfólio / Site</label>
                <input 
                    type="url" 
                    placeholder="https://meuportfolio.com"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={saving || uploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
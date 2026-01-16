"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Building2, ExternalLink, Globe, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FoxLikeButton from "@/components/FoxLikeButton"; // Importe o botão

export default function CompaniesShowcase() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set()); // Guarda os IDs favoritados
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      // 1. Pega usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Busca todas as empresas
      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      
      // 3. Busca os likes DO USUÁRIO
      const { data: likesData } = await supabase
        .from("company_likes")
        .select("company_id")
        .eq("student_id", user.id);

      // Organiza os dados
      if (companiesData) setCompanies(companiesData);
      
      // Cria um Set com os IDs que o aluno curtiu (para busca rápida O(1))
      if (likesData) {
          const ids = new Set(likesData.map(l => l.company_id));
          setLikedIds(ids);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Building2 className="text-purple-500" /> Empresas Parceiras
                </h1>
                <p className="text-gray-400">Conheça as empresas e favorite as que você quer trabalhar.</p>
            </div>
            
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou setor..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#0F0F0F] border border-white/10 rounded-full pl-12 pr-6 py-3 text-white focus:border-purple-500 focus:outline-none w-full md:w-80 transition-all focus:bg-black"
                />
            </div>
        </header>

        {loading ? (
            <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                <Loader2 className="animate-spin mb-4" size={32} />
                Carregando vitrine...
            </div>
        ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#0F0F0F]">
                <p className="text-gray-500">Nenhuma empresa encontrada.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-6">
                {filtered.map((company) => (
                    <div key={company.id} className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-[#141414] transition-all group flex flex-col h-full relative">
                        
                        {/* BOTÃO DE FAVORITAR RAPOSINHA (Canto Superior Direito) */}
                        <div className="absolute top-4 right-4 z-10">
                            <FoxLikeButton 
                                companyId={company.id} 
                                initialIsLiked={likedIds.has(company.id)} 
                            />
                        </div>

                        <div className="flex items-start justify-between mb-4 pr-10"> {/* pr-10 para não bater na raposa */}
                            <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                                {company.logo_url ? (
                                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 className="text-gray-600" size={24} />
                                )}
                            </div>
                        </div>
                        
                        {company.industry && (
                            <div className="mb-3">
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase inline-block">
                                    {company.industry}
                                </span>
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                            {company.name || "Empresa sem nome"}
                        </h3>
                        
                        <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-1">
                            {company.description || "Esta empresa ainda não adicionou uma descrição."}
                        </p>

                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                    <Globe size={14} /> Website
                                </a>
                            )}
                            <button className="ml-auto text-xs font-bold text-purple-500 hover:text-purple-400 flex items-center gap-1">
                                Ver Vagas <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
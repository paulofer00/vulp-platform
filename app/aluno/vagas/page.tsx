import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ArrowLeft, Briefcase, DollarSign, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentJobsPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 1. Verificar Login
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // 2. Buscar Vagas Abertas
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans p-6 md:p-12">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Link href="/aluno/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Mural de Vagas</h1>
                <p className="text-gray-400">Encontre sua próxima oportunidade.</p>
            </div>
        </div>

        {/* Busca (Visual) */}
        <div className="bg-[#0A0A0A] border border-white/10 p-2 rounded-2xl mb-10 flex items-center">
            <div className="p-4 text-gray-500">
                <Search size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Busque por cargo (ex: Editor, Copywriter...)" 
                className="flex-1 py-3 bg-transparent text-white placeholder:text-gray-600 outline-none font-medium"
            />
        </div>

        {/* Lista de Vagas */}
        <div className="grid gap-4">
            {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                    <div key={job.id} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl hover:border-purple-500/50 transition-all group relative overflow-hidden">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                    {job.title}
                                </h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><DollarSign size={14} className="text-green-500"/> {job.salary_range}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-500"/> {job.location}</span>
                                    <span className="px-2 py-0.5 bg-white/5 rounded text-xs border border-white/5">Tempo Integral</span>
                                </div>
                            </div>

                            <Link href={`/aluno/vagas/${job.id}`} className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-white/5 flex items-center justify-center">
    Ver Detalhes
</Link>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <Briefcase size={40} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Nenhuma vaga aberta no momento.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
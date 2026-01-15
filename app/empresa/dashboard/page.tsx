import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Briefcase, LayoutDashboard, LogOut, Plus, Search, Trophy, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CompanyDashboard() {
  const cookieStore = await cookies();
  
  // 1. Conectar no Banco
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 2. Verificar Login
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  // 3. BUSCAR DADOS (MÉTRICAS REAIS) 📊
  
  // A. Contar Vagas Abertas desta empresa
  const { count: openJobsCount } = await supabase
    .from("jobs")
    .select("*", { count: 'exact', head: true })
    .eq("company_id", session.user.id)
    .eq("status", "open");

  // B. Contar Total de Candidatos (Soma de todas as aplicações nas vagas desta empresa)
  // Primeiro pegamos os IDs das vagas da empresa
  const { data: companyJobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("company_id", session.user.id);
    
  const jobIds = companyJobs?.map(job => job.id) || [];
  
  let candidatesCount = 0;
  if (jobIds.length > 0) {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: 'exact', head: true })
        .in("job_id", jobIds);
      candidatesCount = count || 0;
  }

  // C. Contar Total de Talentos na Base (Para mostrar o potencial da plataforma)
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: 'exact', head: true });

  // 4. BUSCAR LISTA DE TALENTOS (Top 6)
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order('points', { ascending: false })
    .limit(6);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-8">
            <div className="flex items-center gap-2">
    <img src="/logo-dark.png" alt="VULP" className="h-8 w-auto" />
    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded border border-slate-200">Business</span>
</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold text-sm transition-colors">
            <LayoutDashboard size={20} /> Visão Geral
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-purple-600 rounded-xl font-medium text-sm transition-colors">
            <Users size={20} /> Banco de Talentos
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-purple-600 rounded-xl font-medium text-sm transition-colors">
            <Briefcase size={20} /> Minhas Vagas
          </a>
        </nav>

        <div className="p-8 border-t border-slate-100">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-medium transition-colors">
                <LogOut size={16} /> Sair da conta
            </Link>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-1 ml-64 p-8 md:p-12">
        
        <header className="flex justify-between items-end mb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel do Recrutador</h1>
                <p className="text-slate-500 mt-2">Gerencie suas vagas e encontre talentos certificados.</p>
            </div>
            
            <Link href="/empresa/vagas/nova" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-200 transition-all hover:-translate-y-1">
                <Plus size={18} /> Nova Vaga
            </Link>
        </header>

        {/* CARDS DE MÉTRICAS REAIS 📊 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Briefcase size={24}/></div>
                    <span className="text-3xl font-bold text-slate-900">{openJobsCount || 0}</span>
                </div>
                <p className="text-sm font-medium text-slate-500">Vagas Abertas</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Users size={24}/></div>
                    <span className="text-3xl font-bold text-slate-900">{candidatesCount}</span>
                </div>
                <p className="text-sm font-medium text-slate-500">Candidatos Totais</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Trophy size={24}/></div>
                    <span className="text-3xl font-bold text-slate-900">{totalStudents || 0}</span>
                </div>
                <p className="text-sm font-medium text-slate-500">Talentos na Base</p>
            </div>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-10 flex items-center">
            <div className="p-4 text-slate-400">
                <Search size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Busque por habilidade (ex: Copywriter, Editor, Tráfego...)" 
                className="flex-1 py-3 text-slate-900 placeholder:text-slate-400 outline-none bg-transparent font-medium"
            />
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                Buscar
            </button>
        </div>

        {/* Lista de Talentos */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Talentos em Destaque</h2>
            <Link href="/vitrine" className="text-sm font-bold text-purple-600 hover:text-purple-700">Ver todos</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {students && students.length > 0 ? (
              students.map((student) => (
                <Link key={student.id} href={`/talento/${student.id}`}>
                    <div className="h-full bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50 transition-all cursor-pointer group flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-purple-600 font-bold text-xl border-2 border-slate-100 group-hover:border-purple-100">
                                {student.avatar_url ? (
                                    <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    student.full_name.charAt(0)
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                                    {student.full_name}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium line-clamp-1 flex items-center gap-1">
                                   <MapPin size={12}/> {student.location || "Brasil"}
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                           {student.bio || "Este talento ainda não adicionou uma bio..."}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-100 flex items-center gap-1">
                                <Trophy size={12} /> {student.points} XP
                            </span>
                        </div>
                        
                        <div className="mt-auto">
                            <button className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                Ver Perfil Completo
                            </button>
                        </div>
                    </div>
                </Link>
              ))
            ) : (
                <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium">Nenhum talento encontrado no banco de dados.</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}
import { ArrowRight, CheckCircle2, Search, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

// ... (imports continuam iguais)

export default function ForCompaniesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-purple-100">
      
      {/* NAV BAR (Versão Light com Logo Dark) */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO AQUI 👇 */}
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
             {/* Estou usando 'logo-dark.png'. Se o nome do arquivo for diferente (ex: logo-preta.png), ajuste aqui */}
             <img src="/logo-dark.png" alt="VULP" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center gap-4">
             <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-purple-600 transition-colors">
                Entrar
             </Link>
             <Link href="/cadastro/empresa" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-purple-600/20">
                Criar Conta
             </Link>
          </div>
        </div>
      </nav>

      {/* ... O resto do main e sections continua igual ... */}

      {/* HERO SECTION */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-600 uppercase tracking-wider">
                    Para Recrutadores e RH
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                    Contrate talentos que <span className="text-purple-600">vestem a camisa</span>.
                </h1>
                
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                    Esqueça pilhas de currículos desqualificados. Na VULP, você acessa jovens treinados, ranqueados por XP e prontos para gerar resultado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link href="/cadastro/empresa" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 hover:scale-105">
                        Começar a Contratar <ArrowRight size={20} />
                    </Link>
                    <a href="#como-funciona" className="px-8 py-4 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
                        Como funciona?
                    </a>
                </div>

                <div className="flex items-center gap-6 pt-4 text-sm text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-500"/> Perfis Verificados</span>
                    <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-green-500"/> Sem custo de setup</span>
                </div>
            </div>

            {/* Ilustração Visual (Cards Flutuantes) */}
            <div className="relative h-[500px] bg-slate-50 rounded-3xl border border-slate-100 p-8 flex items-center justify-center overflow-hidden animate-in slide-in-from-right duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-100/50 to-transparent" />
                
                {/* Card Exemplo Vaga */}
                <div className="absolute top-1/4 right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-64 rotate-3 animate-pulse">
                    <div className="h-2 w-12 bg-purple-100 rounded mb-4" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                </div>

                {/* Card Exemplo Candidato */}
                <div className="relative z-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 w-72">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">JD</div>
                        <div>
                            <div className="font-bold text-slate-900">João da Silva</div>
                            <div className="text-xs text-slate-400">Desenvolvedor Jr</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Nível</span>
                            <span className="font-bold text-purple-600">Ouro 🏆</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Pontuação</span>
                            <span className="font-bold text-slate-900">1.250 XP</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                            <div className="bg-purple-600 h-full w-[80%]" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* SEÇÃO DE BENEFÍCIOS */}
      <section id="como-funciona" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Por que a VULP é diferente?</h2>
                <p className="text-slate-500">Não somos apenas um banco de currículos. Somos uma plataforma de desenvolvimento e validação de talentos.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Benefício 1 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Talentos Validados</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Nossos alunos passam por trilhas de conhecimento e desafios práticos. Você vê o XP real, não apenas o que dizem no currículo.
                    </p>
                </div>

                {/* Benefício 2 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                        <Search size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Filtros Precisos</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Encontre exatamente quem você precisa filtrando por habilidades, nível de XP, cidade e medalhas conquistadas.
                    </p>
                </div>

                {/* Benefício 3 */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-900/5 transition-all">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Contratação Ágil</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Processo simplificado. Publique sua vaga, receba candidaturas instantâneas e converse direto com os melhores.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Pronto para montar seu time dos sonhos?</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Junte-se a centenas de empresas que já estão inovando com a VULP.
                </p>
                <Link href="/cadastro/empresa" className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                    Criar Conta Gratuita <ArrowRight size={20} />
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { 
    Activity, TrendingUp, DollarSign, Target, RefreshCw, AlertTriangle, 
    LayoutDashboard, SlidersHorizontal, PieChart, ReceiptText, LineChart,
    Users, CreditCard, Calculator, Lock, Key, ArrowRight,
    Briefcase, Building2, TrendingDown, Minus
} from "lucide-react";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart as RePieChart, Pie, Cell 
} from 'recharts';

const formatarBRL = (valor: number) => {
    if (valor >= 1000000) return `R$ ${(valor/1000000).toFixed(2).replace('.', ',')} Mi`;
    if (valor >= 10000) return `R$ ${(valor/1000).toFixed(1).replace('.', ',')} mil`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
};

export default function VulpIntelligence() {
  // --- SISTEMA DE SEGURANÇA ---
  const [isLogged, setIsLogged] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [erroLogin, setErroLogin] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  
  const SENHA_MESTRA = "vulp2026";

  // --- ESTADOS GERAIS DO DASHBOARD ---
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("dashboard");

  // --- ESTADOS DO SIMULADOR (AJUSTADOS CONFORME TABELA VULP) ---
  const [alunosPresencial, setAlunosPresencial] = useState(160);
  const [ticketPresencial, setTicketPresencial] = useState(497);
  
  const [alunosOnline, setAlunosOnline] = useState(250);
  const [ticketOnline, setTicketOnline] = useState(49.90);

  const [clientesCoworking, setClientesCoworking] = useState(3);
  const [ticketCoworking, setTicketCoworking] = useState(2000);

  const [clientesB2B, setClientesB2B] = useState(4);
  const [ticketB2B, setTicketB2B] = useState(4000);

  const [tipoCenario, setTipoCenario] = useState<"pessimista" | "conservador" | "otimista">("conservador");

  // 🛑 O NOVO MOTOR MATEMÁTICO (CRESCIMENTO & CHURN) 🛑
  const matrizCenarios = {
      pessimista: { crescPresencial: 0.12, crescOnline: 0.30, churnPresencial: 0.05, churnOnline: 0.07 },
      conservador: { crescPresencial: 0.15, crescOnline: 0.50, churnPresencial: 0.04, churnOnline: 0.04 },
      otimista: { crescPresencial: 0.17, crescOnline: 0.70, churnPresencial: 0.02, churnOnline: 0.03 }
  };

  const calcularProjecaoDinamica = () => {
      const cenario = matrizCenarios[tipoCenario];
      const projecao = [];
      
      let alunosPresAtual = alunosPresencial;
      let alunosOnAtual = alunosOnline;

      for (let ano = 1; ano <= 5; ano++) {
          // Aplica juros compostos de crescimento subtraindo o churn (a partir do ano 2)
          if (ano > 1) {
              alunosPresAtual = alunosPresAtual * (1 + cenario.crescPresencial - cenario.churnPresencial);
              alunosOnAtual = alunosOnAtual * (1 + cenario.crescOnline - cenario.churnOnline);
          }

          // Receitas
          const recPresencial = alunosPresAtual * ticketPresencial * 12;
          const recOnline = alunosOnAtual * ticketOnline * 12;
          const recCoworking = clientesCoworking * ticketCoworking * 12; // Coworking Fixo conforme input
          const recB2B = clientesB2B * ticketB2B * 12; // B2B Fixo conforme input
          const receitaBruta = recPresencial + recOnline + recCoworking + recB2B;

          // Custos Dinâmicos (DRE Vivo)
          const custoFixoAno = (data?.capex_opex?.custo_fixo || 42305.60) * 12;
          // Puxa o custo de R$ 84,49 por aluno presencial que vem do Python
          const custoVarPresencialAno = (data?.capex_opex?.custo_var_presencial || 84.49) * alunosPresAtual * 12;
          // Custo base de servidor/plataforma para alunos online (Estimado R$15/aluno)
          const custoVarOnlineAno = 15 * alunosOnAtual * 12; 
          
          const custoOperacionalTotal = custoFixoAno + custoVarPresencialAno + custoVarOnlineAno;
          const lucroLiquido = receitaBruta - custoOperacionalTotal;

          projecao.push({
              name: `Ano ${ano}`,
              Simulação: receitaBruta, // Para o Gráfico do Simulador
              receitaBruta,
              recPresencial,
              recOnline,
              recCoworking,
              recB2B,
              custoOperacionalTotal,
              custoFixoAno,
              custoVarPresencialAno,
              custoVarOnlineAno,
              lucroLiquido,
              // 👇 AS DUAS LINHAS SALVADORAS AQUI 👇
              alunosPresenciaisVol: Math.round(alunosPresAtual),
              alunosOnlineVol: Math.round(alunosOnAtual)
          });
      }
      return projecao;
  };

  const projecaoDinamica = calcularProjecaoDinamica();
  const dadosAno1 = projecaoDinamica[0];

  const fetchDados = async (forceRefresh = false) => {
    setLoading(true);
    try {
        if(forceRefresh) await fetch("https://vulp-motor.onrender.com/api/refresh");
        const res = await fetch("https://vulp-motor.onrender.com/api/dashboard");
        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
        const json = await res.json();
        setData(json);
    } catch (error) {
        setData({ status: "error", message: "Servidor Python Offline", detalhes: "O motor na Render pode estar a reiniciar. Tente novamente em 30 segundos." });
    }
    setLoading(false);
  };

  useEffect(() => {
    const sessao = sessionStorage.getItem("vulp_auth");
    if (sessao === "true") {
        setIsLogged(true);
        fetchDados();
    }
    setVerificandoSessao(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaInput === SENHA_MESTRA) {
        setIsLogged(true);
        sessionStorage.setItem("vulp_auth", "true");
        fetchDados();
    } else {
        setErroLogin(true);
        setTimeout(() => setErroLogin(false), 2000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vulp_auth");
    setIsLogged(false);
    setData(null);
  };

  if (verificandoSessao) return <div className="min-h-screen bg-[#02000A]" />;
  if (!isLogged) {
      return (
          <div className="min-h-screen bg-[#02000A] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30 relative">
              <div className="mb-12"><img src="/logo-white.png" alt="VULP" className="h-12 w-auto mx-auto" /></div>
              <div className="w-full max-w-md bg-[#0A051A] border border-white/5 rounded-3xl p-10 shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/20 blur-[60px] rounded-full pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                      <div className="w-16 h-16 bg-[#110826] border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 mx-auto shadow-inner"><Lock size={32} /></div>
                      <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Acesso Restrito</h2>
                      <p className="text-gray-400 text-center text-sm mb-8 font-medium">Insira a chave de acesso para visualizar a inteligência financeira da VULP.</p>
                      <form onSubmit={handleLogin} className="space-y-6">
                          <div>
                              <div className="relative"><Key size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" /><input type="password" placeholder="Senha Mestra" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} className={`w-full bg-[#050212] border ${erroLogin ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-bounce' : 'border-white/10 focus:border-indigo-500'} rounded-xl py-4 pl-12 pr-4 text-white font-bold focus:outline-none transition-all`} autoFocus /></div>
                              {erroLogin && <p className="text-red-500 text-xs font-bold mt-2 text-center uppercase tracking-widest animate-pulse">Acesso Negado</p>}
                          </div>
                          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]">Desbloquear Cofre <ArrowRight size={20} /></button>
                      </form>
                  </div>
              </div>
          </div>
      );
  }

  const menuItems = [
    { id: "dashboard", label: "Visão Geral", icon: <LayoutDashboard size={20} /> },
    { id: "cenarios", label: "Simulador de Cenários", icon: <SlidersHorizontal size={20} /> },
    { id: "ganhos", label: "Formas de Ganhos", icon: <PieChart size={20} /> },
    { id: "viabilidade", label: "Valuation & Payback", icon: <LineChart size={20} /> },
    { id: "dre", label: "Projeção DRE", icon: <ReceiptText size={20} /> },
  ];

  // Gráfico de Pizza no Menu Formas de Ganhos alimentado pelo Simulador!
  const dadosGanhosPizza = [
    { name: 'Presencial', value: dadosAno1.recPresencial, color: '#6366f1' }, 
    { name: 'Online', value: dadosAno1.recOnline, color: '#d946ef' }, 
    { name: 'B2B', value: dadosAno1.recB2B, color: '#3b82f6' }, 
    { name: 'Coworking', value: dadosAno1.recCoworking, color: '#ec4899' }, 
  ];

  // Gráfico de Barras alimentado pela projeção de 5 anos do Simulador!
  const dadosGanhosBarras = projecaoDinamica.map(p => ({
    name: p.name,
    Presencial: p.recPresencial,
    Online: p.recOnline,
    B2B: p.recB2B,
    Coworking: p.recCoworking,
  }));

  const dadosPayback = data?.payback ? data.payback.periodos.map((p: number, i: number) => ({
    name: `Ano ${p}`,
    saldo: data.payback.saldo[i],
    prejuizo: data.payback.saldo[i] < 0 ? data.payback.saldo[i] : 0,
    lucro: data.payback.saldo[i] >= 0 ? data.payback.saldo[i] : 0,
  })) : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#110826] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">{entry.name}: {formatarBRL(entry.value)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-[#02000A] text-white font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      <aside className="w-72 bg-[#050212] border-r border-white/5 flex flex-col hidden md:flex shrink-0">
        <div className="p-8 pb-4 flex flex-col items-center">
            <img src="/logo-white.png" alt="VULP" className="h-10 w-auto mb-2" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-center">Intelligence</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
                const isActive = abaAtiva === item.id;
                return (
                    <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${isActive ? "bg-[#4B0082] text-white border border-[#8A2BE2] shadow-[0_0_15px_rgba(138,43,226,0.3)]" : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"}`}>
                        <span className={isActive ? "text-[#BA55D3]" : "text-gray-500"}>{item.icon}</span>{item.label}
                    </button>
                )
            })}
        </nav>
        <div className="p-6 bg-[#0A051A] border-t border-white/5 mt-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 text-center relative z-10">Índices de Mercado (12m)</p>
            <div className="flex justify-between items-center mb-3 relative z-10">
                <span className="text-sm text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> IPCA</span>
                <span className="text-sm font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">{data?.indices?.ipca ? `${data.indices.ipca}%` : "..."}</span>
            </div>
            <div className="flex justify-between items-center relative z-10 mb-4">
                <span className="text-sm text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div> IGP-M</span>
                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{data?.indices?.igpm ? `${data.indices.igpm}%` : "..."}</span>
            </div>
            <button onClick={handleLogout} className="w-full mt-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest py-2 rounded-lg border border-red-500/20 transition-colors relative z-10">Travar Cofre (Sair)</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
        <header className="flex justify-between items-center mb-12">
            <div><h1 className="text-3xl md:text-4xl font-black text-white">{menuItems.find(i => i.id === abaAtiva)?.label}</h1></div>
            <button onClick={() => fetchDados(true)} className="flex items-center gap-2 bg-[#110826] border border-indigo-500/30 hover:border-indigo-500 px-5 py-2.5 rounded-full text-indigo-400 transition-all text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Sincronizar API
            </button>
        </header>

        {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-indigo-500"><Activity size={48} className="animate-bounce mb-4" /><p className="font-bold animate-pulse">Consultando Motor Financeiro...</p></div>
        ) : data?.status === "error" ? (
            <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-4"><AlertTriangle size={32} className="text-red-500" /><h3 className="text-2xl font-black text-white">Falha na API Python</h3></div>
                <p className="text-gray-300 mb-6">{data.message}</p>
                <div className="bg-[#050212] p-4 rounded-xl border border-red-500/20 overflow-x-auto"><p className="text-xs text-red-400 font-bold uppercase mb-2">Detalhes Técnicos:</p><pre className="text-gray-400 text-sm whitespace-pre-wrap">{data.detalhes}</pre></div>
            </div>
        ) : data ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                
                {/* --- VISÃO GERAL --- */}
                {abaAtiva === "dashboard" && (
                    <div className="space-y-12">
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Valuation Estimado", val: formatarBRL(data.valuation.estimado), icon: <TrendingUp />, color: "text-green-400" },
                                { label: "Capital Inicial", val: formatarBRL(data.valuation.capital_inicial), icon: <DollarSign />, color: "text-pink-400" },
                                { label: "Multiplicador (ROI)", val: `${data.valuation.roi}x`, icon: <Target />, color: "text-indigo-400" },
                                { label: "TIR Projetada", val: `${data.valuation.tir}%`, icon: <Activity />, color: "text-yellow-400" },
                            ].map((kpi, idx) => (
                                <div key={idx} className="bg-[#0A051A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors shadow-lg">
                                    <div className={`absolute top-4 right-4 ${kpi.color} opacity-20 group-hover:opacity-100 transition-opacity`}>{kpi.icon}</div>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">{kpi.label}</p>
                                    <h3 className="text-3xl font-black text-white">{kpi.val}</h3>
                                </div>
                            ))}
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#0A051A] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
                                <h3 className="text-2xl font-black mb-2 text-white">Controle de CAPEX (Obra)</h3>
                                <p className="text-gray-500 text-sm mb-8">Acompanhamento de orçamento vs executado.</p>
                                <div className="relative pt-10 pb-6">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest"><span>Já Gasto: {formatarBRL(data.capex_opex.executado)}</span><span>Teto: {formatarBRL(data.capex_opex.orcado)}</span></div>
                                    <div className="w-full bg-[#110826] rounded-full h-6 overflow-hidden border border-white/5"><div className="bg-gradient-to-r from-red-500 to-pink-500 h-full transition-all duration-1000 ease-out" style={{ width: `${(data.capex_opex.executado / data.capex_opex.orcado) * 100}%` }} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-[#110826] rounded-xl p-4 border border-white/5"><p className="text-xs text-gray-500 font-bold uppercase">Custo Fixo (Mensal)</p><p className="text-xl font-bold text-white mt-1">{formatarBRL(data.capex_opex.custo_fixo)}</p></div>
                                    <div className="bg-[#110826] rounded-xl p-4 border border-white/5"><p className="text-xs text-gray-500 font-bold uppercase">Custo Var. Presencial</p><p className="text-xl font-bold text-white mt-1">{formatarBRL(data.capex_opex.custo_var_presencial)}</p></div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-[#1A0B3B] to-[#0A051A] border border-purple-500/40 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.2)] flex flex-col justify-center items-center text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                                <SlidersHorizontal size={48} className="text-purple-400 mb-4" />
                                <h3 className="text-2xl font-black text-white mb-2">Simulador Ativo</h3>
                                <p className="text-gray-400 text-sm mb-6">As projeções de Receita e DRE agora obedecem às variáveis configuradas no simulador de cenários.</p>
                                <button onClick={() => setAbaAtiva("cenarios")} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">Acessar Simulador</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SIMULADOR DE CENÁRIOS (AGORA AFETA TUDO) --- */}
                {abaAtiva === "cenarios" && (
                    <div className="space-y-8">
                        <div className="bg-[#0A051A] border border-indigo-500/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                            
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Matriz de Simulação VULP</h3>
                                    <p className="text-gray-400 text-sm mt-1">Integração viva: alterar estes dados afetará instantaneamente o DRE e os Gráficos.</p>
                                </div>

                                {/* SELETOR DE CENÁRIO (APLICA CHURN E CRESCIMENTO DA TABELA) */}
                                <div className="flex bg-[#110826] p-1.5 rounded-xl border border-white/10">
                                    <button onClick={() => setTipoCenario("pessimista")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tipoCenario === "pessimista" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-500 hover:text-gray-300"}`}>
                                        <TrendingDown size={16} /> Pessimista
                                    </button>
                                    <button onClick={() => setTipoCenario("conservador")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tipoCenario === "conservador" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-500 hover:text-gray-300"}`}>
                                        <Minus size={16} /> Conservador
                                    </button>
                                    <button onClick={() => setTipoCenario("otimista")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tipoCenario === "otimista" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-500 hover:text-gray-300"}`}>
                                        <TrendingUp size={16} /> Otimista
                                    </button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* CONTROLADORES */}
                                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Presencial */}
                                    <div className="bg-[#110826] p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-lg font-bold text-indigo-400 mb-5 flex items-center gap-2"><Users size={18} /> Presencial (Ano 1)</h4>
                                        <div className="mb-5">
                                            <div className="flex justify-between mb-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alunos</label><span className="text-lg font-black text-white">{alunosPresencial}</span></div>
                                            {/* Max ajustado para 320 */}
                                            <input type="range" min="50" max="320" value={alunosPresencial} onChange={(e) => setAlunosPresencial(Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Ticket Médio (R$)</label>
                                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span><input type="number" value={ticketPresencial} onChange={(e) => setTicketPresencial(Number(e.target.value))} className="w-full bg-[#050212] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white font-bold text-sm focus:outline-none focus:border-indigo-500 transition-colors" /></div>
                                        </div>
                                    </div>

                                    {/* Online */}
                                    <div className="bg-[#110826] p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-lg font-bold text-fuchsia-400 mb-5 flex items-center gap-2"><CreditCard size={18} /> Online (Ano 1)</h4>
                                        <div className="mb-5">
                                            <div className="flex justify-between mb-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alunos</label><span className="text-lg font-black text-white">{alunosOnline}</span></div>
                                            <input type="range" min="50" max="2000" step="50" value={alunosOnline} onChange={(e) => setAlunosOnline(Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Ticket Médio (R$)</label>
                                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span><input type="number" value={ticketOnline} onChange={(e) => setTicketOnline(Number(e.target.value))} className="w-full bg-[#050212] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white font-bold text-sm focus:outline-none focus:border-fuchsia-500 transition-colors" /></div>
                                        </div>
                                    </div>

                                    {/* Coworking */}
                                    <div className="bg-[#110826] p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-lg font-bold text-pink-400 mb-5 flex items-center gap-2"><Briefcase size={18} /> Coworking</h4>
                                        <div className="mb-5">
                                            <div className="flex justify-between mb-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Residentes</label><span className="text-lg font-black text-white">{clientesCoworking}</span></div>
                                            {/* Max ajustado para 5 */}
                                            <input type="range" min="0" max="5" value={clientesCoworking} onChange={(e) => setClientesCoworking(Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mensalidade (R$)</label>
                                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span><input type="number" value={ticketCoworking} onChange={(e) => setTicketCoworking(Number(e.target.value))} className="w-full bg-[#050212] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white font-bold text-sm focus:outline-none focus:border-pink-500 transition-colors" /></div>
                                        </div>
                                    </div>

                                    {/* Parceiros B2B */}
                                    <div className="bg-[#110826] p-5 rounded-2xl border border-white/5">
                                        <h4 className="text-lg font-bold text-blue-400 mb-5 flex items-center gap-2"><Building2 size={18} /> Parceiros B2B</h4>
                                        <div className="mb-5">
                                            <div className="flex justify-between mb-2"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Empresas</label><span className="text-lg font-black text-white">{clientesB2B}</span></div>
                                            {/* Max ajustado para 5 */}
                                            <input type="range" min="0" max="5" value={clientesB2B} onChange={(e) => setClientesB2B(Number(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Contrato Médio (R$)</label>
                                            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">R$</span><input type="number" value={ticketB2B} onChange={(e) => setTicketB2B(Number(e.target.value))} className="w-full bg-[#050212] border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white font-bold text-sm focus:outline-none focus:border-blue-500 transition-colors" /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* RESULTADOS DO SIMULADOR */}
                                <div className="lg:col-span-5 flex flex-col gap-6">
                                    <div className="bg-gradient-to-br from-[#1A0B3B] to-[#0A051A] border border-purple-500/40 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                                        <div className="flex items-center gap-2 mb-2 relative z-10"><Calculator size={20} className="text-green-400"/><h4 className="text-lg font-bold text-white">Faturamento Base (Ano 1)</h4></div>
                                        <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Receita Bruta Total Simulada</p>
                                        <p className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 relative z-10">{formatarBRL(dadosAno1.receitaBruta)}</p>
                                        
                                        <div className="mt-6 pt-4 border-t border-purple-500/20 grid grid-cols-2 gap-2 relative z-10">
                                            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Presencial</p><p className="text-sm font-bold text-indigo-300">{formatarBRL(dadosAno1.recPresencial)}</p></div>
                                            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Online</p><p className="text-sm font-bold text-fuchsia-300">{formatarBRL(dadosAno1.recOnline)}</p></div>
                                            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Coworking</p><p className="text-sm font-bold text-pink-300">{formatarBRL(dadosAno1.recCoworking)}</p></div>
                                            <div><p className="text-[10px] text-gray-400 uppercase font-bold">B2B</p><p className="text-sm font-bold text-blue-300">{formatarBRL(dadosAno1.recB2B)}</p></div>
                                        </div>
                                    </div>

                                    <div className="bg-[#110826] border border-white/5 p-6 rounded-3xl flex-1 flex flex-col">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Curva de Projeção (5 Anos)</h4>
                                        <div className="h-full min-h-[180px] w-full mt-auto">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={projecaoDinamica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorCrescimento" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={tipoCenario === 'otimista' ? '#10b981' : tipoCenario === 'conservador' ? '#3b82f6' : '#ef4444'} stopOpacity={0.4}/>
                                                            <stop offset="95%" stopColor={tipoCenario === 'otimista' ? '#10b981' : tipoCenario === 'conservador' ? '#3b82f6' : '#ef4444'} stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="name" stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 10}} axisLine={false} tickLine={false} />
                                                    <YAxis tickFormatter={(val) => `R$${(val/1000000).toFixed(1)}M`} stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 10}} axisLine={false} tickLine={false} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="Simulação" stroke={tipoCenario === 'otimista' ? '#10b981' : tipoCenario === 'conservador' ? '#3b82f6' : '#ef4444'} strokeWidth={3} fillOpacity={1} fill="url(#colorCrescimento)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- FORMAS DE GANHOS (AGORA OBEDECE AO SIMULADOR) --- */}
                {abaAtiva === "ganhos" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-[#0A051A] border border-white/5 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-black mb-6 text-white text-center">Mix de Receita (Ano 1)</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie data={dadosGanhosPizza} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                                            {dadosGanhosPizza.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#fff', fontSize: '14px' }}/>
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-[#0A051A] border border-white/5 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-black mb-6 text-white">Projeção do Mix (5 Anos)</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dadosGanhosBarras} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(val) => `R$ ${(val/1000)}k`} stroke="#6b7280" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                                        <Bar dataKey="Presencial" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="Online" stackId="a" fill="#d946ef" />
                                        <Bar dataKey="B2B" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="Coworking" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VALUATION E PAYBACK --- */}
                {abaAtiva === "viabilidade" && (
                    <div className="bg-[#0A051A] border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2"><LineChart className="text-fuchsia-500" /> Fluxo de Caixa Acumulado</h3>
                            <p className="text-gray-400">A "Travessia do Deserto". Visualize o momento exato em que o projeto atinge o Break-even e começa a dar lucro real (Payback).</p>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dadosPayback} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPreju" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                                        <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(val) => `R$ ${(val/1000)}k`} stroke="#6b7280" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <CartesianGrid y={0} stroke="#ffffff50" />
                                    <Area type="monotone" dataKey="prejuizo" name="Investimento / Prejuízo" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPreju)" />
                                    <Area type="monotone" dataKey="lucro" name="Lucro Realizado" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLucro)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* --- PROJEÇÃO DRE VIVA E DINÂMICA --- */}
                {abaAtiva === "dre" && (
                    <div className="bg-[#0A051A] border border-white/5 rounded-3xl p-8 shadow-xl">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-2"><ReceiptText className="text-green-500"/> DRE Dinâmico (Ano 1 a Ano 5)</h3>
                                <p className="text-gray-400 text-sm mt-1">Os custos variáveis acompanham o volume de alunos definido no Simulador de Cenários.</p>
                            </div>
                            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                                Cenário: {tipoCenario}
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-[#110826] text-xs uppercase text-gray-300 font-bold">
                                    <tr><th className="px-6 py-4">Categoria</th>{[1,2,3,4,5].map(i=><th key={i} className="px-6 py-4 text-right">Ano {i}</th>)}</tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/5 bg-indigo-900/10">
                                        <td className="px-6 py-4 font-bold text-indigo-400">Receitas Brutas Totais</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-4 text-indigo-300 font-bold text-right">{formatarBRL(p.receitaBruta)}</td>)}
                                    </tr>
                                    
                                    {/* Linhas de Custos */}
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-red-400 font-bold">- Custos Operacionais Totais</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-4 text-red-400 font-bold text-right">{formatarBRL(p.custoOperacionalTotal)}</td>)}
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
                                        <td className="px-6 py-2 text-gray-500 pl-10">↳ Custo Fixo (Anual)</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-2 text-gray-500 text-right">{formatarBRL(p.custoFixoAno)}</td>)}
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
                                        <td className="px-6 py-2 text-gray-500 pl-10">↳ Custo Variável (Alunos Presencial)</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-2 text-gray-500 text-right">{formatarBRL(p.custoVarPresencialAno)} <span className="text-[10px] block text-gray-700">{p.alunosPresenciaisVol} un.</span></td>)}
                                    </tr>
                                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs">
                                        <td className="px-6 py-2 text-gray-500 pl-10">↳ Custo Variável (Plataforma Online)</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-2 text-gray-500 text-right">{formatarBRL(p.custoVarOnlineAno)} <span className="text-[10px] block text-gray-700">{p.alunosOnlineVol} un.</span></td>)}
                                    </tr>

                                    <tr className="bg-gradient-to-r from-green-900/20 to-[#0A051A]">
                                        <td className="px-6 py-5 font-black text-green-400 uppercase text-base">Lucro Líquido Projetado</td>
                                        {projecaoDinamica.map((p, i) => <td key={i} className="px-6 py-5 font-black text-green-400 text-base text-right">{formatarBRL(p.lucroLiquido)}</td>)}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        ) : <p className="text-red-500">Falha crítica desconhecida.</p>}
      </main>
    </div>
  );
}
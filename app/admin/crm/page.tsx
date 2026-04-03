"use client";

import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle, Clock, Rocket, ArrowRight, Lock, KeyRound, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CRMBoard() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const TEAM_PASSWORD = "vulpadmin";

  // --- ESTADOS DO CRM ---
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ESTADOS DA LIXEIRA (POP-UP) ---
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    const isLogged = localStorage.getItem("vulp_crm_auth");
    if (isLogged === "true") {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === TEAM_PASSWORD) {
      localStorage.setItem("vulp_crm_auth", "true");
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 3000);
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/crm");
      const result = await response.json();

      if (result.data) {
        const cleanedData = result.data.map((lead: any) => ({
          ...lead,
          status: (lead.status?.replace(/'/g, '') || 'pendente').toLowerCase()
        }));
        setLeads(cleanedData);
      }
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
    }
    setIsLoading(false);
  };

  const updateLeadStatus = async (id: number, newStatus: string) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    await fetch("/api/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  // --- FUNÇÃO PARA APAGAR O LEAD ---
  const confirmDelete = async () => {
    if (!leadToDelete) return;

    // Remove da tela na hora
    setLeads((prev) => prev.filter((lead) => lead.id !== leadToDelete.id));

    // Manda o garçom apagar no banco
    await fetch("/api/crm", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: leadToDelete.id }),
    });

    // Fecha o modal e limpa tudo
    setLeadToDelete(null);
    setDeleteInput("");
  };

  const handleWhatsApp = (lead: any) => {
    const cleanPhone = lead.phone.replace(/\D/g, '');
    const message = `Olá, ${lead.name}! Vi que você garantiu interesse no curso Posicione-se Agora. Tudo bem?`;
    const waUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    if (lead.status === "pendente") updateLeadStatus(lead.id, "contatado");
    window.open(waUrl, "_blank");
  };

  const logOut = () => {
    localStorage.removeItem("vulp_crm_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#02000A] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
        <div className="w-full max-w-md bg-[#0A051A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20"><Lock size={32} className="text-indigo-400" /></div>
          <h1 className="text-2xl font-black text-center text-white mb-2">Área Restrita</h1>
          <p className="text-center text-gray-400 text-sm mb-8">Digite a senha da equipa para acessar o CRM VULP.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><KeyRound size={18} className="text-gray-500" /></div>
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Senha de Acesso" className="w-full bg-[#050212] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" autoFocus />
              </div>
              {authError && <p className="text-red-500 text-xs mt-2 text-center font-bold">❌ Senha incorreta.</p>}
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:scale-[1.02]">Destrancar CRM</button>
          </form>
        </div>
      </div>
    );
  }

  const pendentes = leads.filter((l) => l.status === "pendente");
  const contatados = leads.filter((l) => l.status === "contatado");
  const compradores = leads.filter((l) => l.status === "comprador");

  return (
    <div className="min-h-screen bg-[#02000A] text-white p-8 font-sans selection:bg-indigo-500/30 relative">
      
      <header className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center gap-3">
            <Rocket size={32} className="text-indigo-500" /> CRM VULP
          </h1>
          <p className="text-gray-400 mt-2">Controle de Leads e Vendas em Tempo Real</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={logOut} className="text-xs text-gray-500 hover:text-white transition-colors">Sair da Conta</button>
          <Link href="/" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/10">Voltar ao Site</Link>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="bg-[#0A051A] rounded-2xl border border-white/5 p-4 flex flex-col h-[75vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-bold flex items-center gap-2 text-gray-300"><Clock size={18} className="text-yellow-500" /> Pendentes</h2>
              <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded-full">{pendentes.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {pendentes.map((lead) => <LeadCard key={lead.id} lead={lead} onWhatsApp={() => handleWhatsApp(lead)} onMove={(status) => updateLeadStatus(lead.id, status)} onDelete={() => setLeadToDelete(lead)} />)}
              {pendentes.length === 0 && <EmptyState text="Nenhum lead pendente." />}
            </div>
          </div>

          <div className="bg-[#0A051A] rounded-2xl border border-white/5 p-4 flex flex-col h-[75vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-bold flex items-center gap-2 text-gray-300"><MessageCircle size={18} className="text-blue-500" /> Contatados</h2>
              <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded-full">{contatados.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {contatados.map((lead) => <LeadCard key={lead.id} lead={lead} onWhatsApp={() => handleWhatsApp(lead)} onMove={(status) => updateLeadStatus(lead.id, status)} onDelete={() => setLeadToDelete(lead)} />)}
              {contatados.length === 0 && <EmptyState text="Nenhum lead contatado." />}
            </div>
          </div>

          <div className="bg-[#0A051A] rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)] p-4 flex flex-col h-[75vh]">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-bold flex items-center gap-2 text-indigo-400"><CheckCircle size={18} className="text-green-500" /> Compradores</h2>
              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">{compradores.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {compradores.map((lead) => <LeadCard key={lead.id} lead={lead} onWhatsApp={() => handleWhatsApp(lead)} onMove={(status) => updateLeadStatus(lead.id, status)} onDelete={() => setLeadToDelete(lead)} isBuyer />)}
              {compradores.length === 0 && <EmptyState text="Aguardando a primeira venda cair..." />}
            </div>
          </div>
        </div>
      )}

      {/* --- POP-UP DE DELETAR (MODAL) --- */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setLeadToDelete(null); setDeleteInput(""); }} />
          <div className="relative bg-[#0A051A] border border-red-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4 mx-auto text-red-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Apagar Lead?</h3>
            <p className="text-sm text-center text-gray-400 mb-6">
              Você está prestes a apagar <strong className="text-white">{leadToDelete.name}</strong> permanentemente do banco de dados. Esta ação não pode ser desfeita.
            </p>
            <p className="text-xs font-bold text-center text-gray-500 uppercase mb-2">Digite <span className="text-red-400">apagar</span> para confirmar</p>
            <input 
              type="text" 
              value={deleteInput} 
              onChange={(e) => setDeleteInput(e.target.value)} 
              placeholder="apagar" 
              className="w-full bg-[#050212] border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-red-500 transition-colors mb-6"
            />
            <div className="flex gap-3">
              <button onClick={() => { setLeadToDelete(null); setDeleteInput(""); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">Cancelar</button>
              <button 
                onClick={confirmDelete} 
                disabled={deleteInput.toLowerCase() !== "apagar"} 
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 disabled:text-white/30 text-white rounded-xl text-sm font-bold transition-colors"
              >
                Sim, Apagar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}} />
    </div>
  );
}

// COMPONENTE: CARD DO LEAD
function LeadCard({ lead, onWhatsApp, onMove, onDelete, isBuyer = false }: { lead: any, onWhatsApp: () => void, onMove: (s: string) => void, onDelete: () => void, isBuyer?: boolean }) {
  const date = new Date(lead.created_at).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`relative p-4 rounded-xl border group ${isBuyer ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-[#110826] border-white/5'} hover:border-white/20 transition-colors`}>
      
      {/* BOTÃO DA LIXEIRA (Aparece no hover) */}
      <button 
        onClick={onDelete} 
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        title="Apagar Lead"
      >
        <Trash2 size={16} />
      </button>

      <h3 className="font-bold text-white text-sm pr-6 truncate">{lead.name}</h3>
      <p className="text-xs text-gray-500 mt-1 truncate">{lead.email}</p>
      <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1"><Clock size={10} /> {date}</p>
      
      <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
        <button onClick={onWhatsApp} className="flex-1 bg-[#00D775]/10 hover:bg-[#00D775]/20 text-[#00D775] text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
          <MessageCircle size={14} /> Chamar
        </button>
        
        {!isBuyer && (
          <div className="relative group/menu">
            <button className="h-full px-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors flex items-center justify-center">
              <ArrowRight size={14} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#1A0B2E] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col overflow-hidden">
              <button onClick={() => onMove("pendente")} className="text-xs text-left px-3 py-2 hover:bg-white/5 text-yellow-500">Voltar a Pendente</button>
              <button onClick={() => onMove("contatado")} className="text-xs text-left px-3 py-2 hover:bg-white/5 text-blue-500">Marcar Contatado</button>
              <button onClick={() => onMove("comprador")} className="text-xs text-left px-3 py-2 hover:bg-white/5 text-green-500 border-t border-white/5">Marcar Comprador</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-full flex items-center justify-center text-center p-6 border-2 border-dashed border-white/5 rounded-xl">
      <p className="text-xs text-gray-600">{text}</p>
    </div>
  );
}
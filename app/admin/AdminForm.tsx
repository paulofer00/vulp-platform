"use client";

import { useState } from "react";
import { createUserAsAdmin } from "../actions/admin";
import { Building2, GraduationCap, Loader2, Lock, Plus, UserPlus, X, Search, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import UserList from "./UserList";
import { pdf } from "@react-pdf/renderer";
import { ContractPDF } from "../../components/ContractPDF"; // Ajuste do caminho relativo

export default function AdminForm() {
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para Lógica "Sponte" (Matrícula)
  const [role, setRole] = useState("student");
  const [matricula, setMatricula] = useState("");
  
  // Estado para Endereço (ViaCEP)
  const [address, setAddress] = useState({
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
    complemento: ""
  });

  // Estado para Dados Pessoais (Para gerar o Contrato)
  const [personalData, setPersonalData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    course: "Marketing Digital", // Padrão
    value: "1500,00"
  });

  // --- 1. GERADOR DE MATRÍCULA ---
  function generateMatricula() {
    const year = new Date().getFullYear();
    const semester = new Date().getMonth() < 6 ? "1" : "2";
    // Simulação: Num app real, buscaríamos o último ID do banco + 1
    const randomSeq = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newMatricula = `${year}${semester}${randomSeq}`;
    setMatricula(newMatricula);
  }

  // --- 2. BUSCA DE ENDEREÇO (ViaCEP) ---
  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
          cep: cep
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
    }
    setCepLoading(false);
  }

  // --- 3. GERAÇÃO DE CONTRATO (PDF) ---
  async function generateContract() {
    if (!personalData.name || !personalData.cpf) {
      alert("Por favor, preencha Nome e CPF para gerar o contrato.");
      return;
    }

    // Cria o blob do PDF
    const blob = await pdf(
      <ContractPDF 
        studentName={personalData.name}
        cpf={personalData.cpf}
        address={`${address.rua}, ${address.numero} - ${address.bairro}, ${address.cidade}/${address.uf}`}
        course={personalData.course}
        value={personalData.value}
        matricula={matricula}
      />
    ).toBlob();

    // Força o download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contrato_${personalData.name}_VULP.pdf`;
    link.click();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    // Adiciona dados extras que não estão nos inputs simples
    formData.append("full_address", JSON.stringify(address));
    formData.append("matricula", matricula);

    const result = await createUserAsAdmin(formData);

    if (result.error) {
        setMessage("❌ " + result.error);
    } else {
        setMessage("✅ Usuário criado com sucesso!");
        setTimeout(() => {
            setIsModalOpen(false);
            setMessage("");
        }, 1500);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* CABEÇALHO DO PAINEL */}
        <header className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lock className="text-red-500"/> Painel Super Admin
                </h1>
                <p className="text-slate-400">Gerencie a escola, matrículas e contratos.</p>
            </div>
            
            <div className="flex gap-4">
                <Link href="/" className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Sair
                </Link>
                <button 
                    onClick={() => { setIsModalOpen(true); generateMatricula(); }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
                >
                    <Plus size={18} /> Nova Matrícula
                </button>
            </div>
        </header>

        <UserList />

        {/* MODAL DE CADASTRO */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 my-10">
                    
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                <UserPlus className="text-purple-500"/> Ficha Cadastral
                            </h2>
                            {role === 'student' && (
                                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex flex-col items-end">
                                    <span className="text-[10px] uppercase text-slate-400 font-bold">Matrícula ID</span>
                                    <span className="text-xl font-mono font-bold text-green-400 tracking-wider">{matricula || "..."}</span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* COLUNA ESQUERDA: Dados Pessoais */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                    <GraduationCap size={16}/> Dados do Aluno
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Tipo de Conta</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="cursor-pointer">
                                            <input 
                                                type="radio" name="role" value="student" 
                                                checked={role === 'student'} 
                                                onChange={() => setRole('student')} 
                                                className="peer sr-only" 
                                            />
                                            <div className="p-3 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-500 peer-checked:text-white text-slate-400 flex items-center justify-center gap-2 transition-all">
                                                <GraduationCap size={18} /> Aluno
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input 
                                                type="radio" name="role" value="company" 
                                                checked={role === 'company'}
                                                onChange={() => setRole('company')} 
                                                className="peer sr-only" 
                                            />
                                            <div className="p-3 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white text-slate-400 flex items-center justify-center gap-2 transition-all">
                                                <Building2 size={18} /> Empresa
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                                        <input 
                                            name="name" required 
                                            onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">CPF</label>
                                        <input 
                                            name="cpf" required placeholder="000.000.000-00"
                                            onChange={(e) => setPersonalData({...personalData, cpf: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Celular / WhatsApp</label>
                                        <input name="phone" placeholder="(00) 00000-0000" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">E-mail (Login)</label>
                                        <input name="email" type="email" required className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                                    </div>
                                     <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Senha Padrão</label>
                                        <input name="password" type="text" required defaultValue="vulp123" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" />
                                    </div>
                                </div>
                            </div>

                            {/* COLUNA DIREITA: Endereço & Contrato */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={16}/> Endereço (Automático)
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1 relative">
                                        <label className="text-xs font-bold text-slate-400 uppercase">CEP</label>
                                        <input 
                                            name="cep" 
                                            placeholder="00000-000" 
                                            onBlur={handleCepBlur}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none pl-9" 
                                        />
                                        <Search size={14} className="absolute left-3 top-10 text-slate-500" />
                                        {cepLoading && <Loader2 size={14} className="absolute right-3 top-10 text-purple-500 animate-spin" />}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Rua / Logradouro</label>
                                        <input name="rua" value={address.rua} readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Número</label>
                                        <input 
                                            name="numero" 
                                            onChange={(e) => setAddress({...address, numero: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none" 
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Bairro</label>
                                        <input name="bairro" value={address.bairro} readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300 cursor-not-allowed" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Cidade</label>
                                        <input name="cidade" value={address.cidade} readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">UF</label>
                                        <input name="uf" value={address.uf} readOnly className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300 cursor-not-allowed" />
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-6">
                                     <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                        <FileText size={16}/> Documentação & Efetivação
                                    </h3>
                                    
                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={generateContract}
                                            className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 py-3 rounded-xl font-bold text-xs uppercase flex flex-col items-center gap-1 transition-colors"
                                        >
                                            <FileText size={18} /> Gerar Contrato PDF
                                        </button>
                                        
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-xs uppercase flex flex-col items-center gap-1 transition-colors shadow-lg shadow-green-900/20"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={18} /> Confirmar Matrícula</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        
                        {message && (
                            <div className={`mt-6 p-4 rounded-xl font-bold text-center text-sm ${message.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
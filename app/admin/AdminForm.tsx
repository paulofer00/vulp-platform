"use client";

import { useState } from "react";
import { createUserAsAdmin } from "../actions/admin";
import { Building2, GraduationCap, Loader2, Lock, Plus, UserPlus, X } from "lucide-react";
import Link from "next/link";
import UserList from "./UserList";

export default function AdminForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do Modal

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await createUserAsAdmin(formData);

    if (result.error) {
        setMessage("❌ " + result.error);
    } else {
        setMessage("✅ Usuário criado com sucesso!");
        (e.target as HTMLFormElement).reset();
        
        // Fecha o modal automaticamente após 2 segundos de sucesso
        setTimeout(() => {
            setIsModalOpen(false);
            setMessage(""); // Limpa msg para a próxima
        }, 1500);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* CABEÇALHO */}
        <header className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lock className="text-red-500"/> Painel Super Admin
                </h1>
                <p className="text-slate-400">Gerencie todos os usuários da plataforma.</p>
            </div>
            
            <div className="flex gap-4">
                <Link href="/" className="px-4 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                    Sair
                </Link>
                {/* BOTÃO QUE ABRE O MODAL */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
                >
                    <Plus size={18} /> Adicionar Usuário
                </button>
            </div>
        </header>

        {/* LISTA (OCUPA TUDO AGORA) */}
        <UserList />

        {/* MODAL (FORMULÁRIO) - Só aparece se isModalOpen for true */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                
                {/* CAIXA DO MODAL */}
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200">
                    
                    {/* Botão Fechar */}
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <UserPlus size={24} className="text-purple-500"/> Novo Usuário
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Conta</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="cursor-pointer">
                                        <input type="radio" name="role" value="student" defaultChecked className="peer sr-only" />
                                        <div className="p-3 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-500 peer-checked:text-white text-slate-400 flex flex-col items-center gap-1 transition-all hover:bg-slate-700">
                                            <GraduationCap size={20} />
                                            <span className="font-bold text-xs">Aluno</span>
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input type="radio" name="role" value="company" className="peer sr-only" />
                                        <div className="p-3 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white text-slate-400 flex flex-col items-center gap-1 transition-all hover:bg-slate-700">
                                            <Building2 size={20} />
                                            <span className="font-bold text-xs">Empresa</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                                <input name="name" type="text" required placeholder="Ex: Nike" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
                                <input name="email" type="email" required placeholder="email@vulp.com" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase">Senha</label>
                                <input name="password" type="text" required placeholder="123456" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>

                            {message && (
                                <div className={`p-3 rounded-lg font-bold text-center text-sm ${message.includes('❌') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {message}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 mt-2">
                                {loading ? <Loader2 className="animate-spin" /> : "Confirmar Criação"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { signup } from "../actions";
import { useState } from "react";

export default function CompanySignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", "company"); // Define como Empresa

    const result = await signup(formData);
    
    if (result?.error) {
        setError(result.error);
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans relative overflow-hidden">
      
      {/* Decoração Roxa (Suave no fundo claro) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-200/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/cadastro" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-purple-900/5">
            
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 border border-purple-100">
                    <Building2 size={28} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Conta Empresarial</h1>
                <p className="text-slate-500 text-sm mt-2 text-center">
                    Cadastre sua empresa para encontrar e contratar os melhores talentos da VULP.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nome da Empresa</label>
                    <input 
                        name="fullName" 
                        type="text" 
                        required 
                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all" 
                        placeholder="Ex: Agência Vulp" 
                    />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">E-mail Corporativo</label>
                    <input 
                        name="email" 
                        type="email" 
                        required 
                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all" 
                        placeholder="rh@empresa.com" 
                    />
                </div>
                
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Senha de Acesso</label>
                    <input 
                        name="password" 
                        type="password" 
                        required 
                        className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all" 
                        placeholder="••••••••" 
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button 
                    disabled={loading} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-purple-600/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Criar Conta Empresarial"}
                </button>
            </form>
            
            <p className="text-center text-xs text-slate-400 mt-6">
                Ao criar uma conta, você concorda com nossos <a href="#" className="text-purple-600 hover:underline">Termos de Uso</a>.
            </p>
        </div>
      </div>
    </div>
  );
}
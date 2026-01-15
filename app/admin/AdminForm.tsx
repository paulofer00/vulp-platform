"use client";

import { useState } from "react";
import { createUserAsAdmin } from "../actions/admin";
import { Building2, GraduationCap, Loader2, Lock, Plus, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AdminForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-6 md:p-12">
      <div className="max-w-xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lock className="text-red-500"/> Painel Super Admin
                </h1>
                <p className="text-slate-400">Adicione usuários manualmente na plataforma.</p>
            </div>
            <Link href="/" className="text-sm text-slate-500 hover:text-white">Sair</Link>
        </header>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserPlus size={20} className="text-purple-500"/> Novo Usuário
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Tipo de Conta</label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input type="radio" name="role" value="student" defaultChecked className="peer sr-only" />
                            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-purple-600 peer-checked:border-purple-500 peer-checked:text-white text-slate-400 flex flex-col items-center gap-2 transition-all hover:bg-slate-700">
                                <GraduationCap size={24} />
                                <span className="font-bold text-sm">Aluno</span>
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input type="radio" name="role" value="company" className="peer sr-only" />
                            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white text-slate-400 flex flex-col items-center gap-2 transition-all hover:bg-slate-700">
                                <Building2 size={24} />
                                <span className="font-bold text-sm">Empresa</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Nome (ou Nome da Empresa)</label>
                    <input name="name" type="text" required placeholder="Ex: João Silva ou Agência Vulp" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">E-mail de Acesso</label>
                    <input name="email" type="email" required placeholder="email@exemplo.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">Senha Temporária</label>
                    <input name="password" type="text" required placeholder="123456" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>

                {message && (
                    <div className={`p-4 rounded-xl font-bold text-sm ${message.includes('❌') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message}
                    </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20">
                    {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Criar Usuário</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
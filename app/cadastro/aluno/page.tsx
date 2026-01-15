"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import { signup } from "../actions";
import { useState } from "react";

export default function StudentSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("role", "student"); // FORÇA O CARGO ALUNO

    const result = await signup(formData); // Chama nosso motor
    
    // Se a função signup retornar algo, é erro (pois sucesso redireciona)
    if (result?.error) {
        setError(result.error);
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans relative overflow-hidden">
      {/* Decoração Roxa */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link href="/cadastro" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft size={16} /> Voltar
        </Link>

        <div className="bg-[#0A0A0A] border border-purple-500/20 p-8 rounded-3xl shadow-2xl shadow-purple-900/10">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4 border border-purple-500/20">
                    <GraduationCap size={24} />
                </div>
                <h1 className="text-2xl font-bold">Criar conta de Aluno</h1>
                <p className="text-gray-400 text-sm mt-1">Sua jornada começa agora.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                    <input name="fullName" type="text" required className="w-full mt-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Seu nome" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                    <input name="email" type="email" required className="w-full mt-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="seu@email.com" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
                    <input name="password" type="password" required className="w-full mt-1 bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="••••••••" />
                </div>

                {error && <div className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}

                <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2">
                    {loading ? <Loader2 className="animate-spin" /> : "Finalizar Cadastro"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
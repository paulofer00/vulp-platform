"use client";

import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle, GraduationCap } from "lucide-react";

export default function CadastroAluno() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: name,
          role: "student", // Força o papel de Aluno
        },
      },
    });

    if (error) {
      alert("Erro ao cadastrar: " + error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  // TELA DE SUCESSO
  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verifique seu E-mail</h2>
          <p className="text-gray-400 mb-6">
            Enviamos um link de confirmação para <strong className="text-white">{email}</strong>.
            <br />
            Clique no link para ativar sua conta de <strong>Aluno</strong>.
          </p>
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold text-sm hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  // FORMULÁRIO DE ALUNO
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Detalhe de fundo */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/cadastro" className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors z-10">
        <ArrowLeft size={20} /> Voltar
      </Link>

      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <GraduationCap size={32} className="text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Cadastro de Aluno</h1>
            <p className="text-gray-400 mt-2">Comece sua jornada profissional agora.</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-sm">
            <form onSubmit={handleSignUp} className="space-y-4">
                
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Seu Nome</label>
                    <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="Nome completo"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">E-mail</label>
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="seu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Senha</label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Criar Conta de Aluno"}
                </button>
            </form>
        </div>

        <p className="text-center text-gray-500 text-sm">
            Já tem conta? <Link href="/login" className="text-purple-400 hover:underline font-bold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
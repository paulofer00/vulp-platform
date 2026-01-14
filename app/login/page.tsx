"use client";

import { createClient } from "@supabase/supabase-js"; // Vamos usar direto por enquanto para simplificar
import { ArrowLeft, Building2, GraduationCap, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Configuração rápida do cliente (depois moveremos para um hook melhor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"student" | "company">("student");
  const [loading, setLoading] = useState(false);
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tentar fazer login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // 2. Verificar o tipo de usuário no banco
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      // 3. Redirecionar para o lugar certo
      if (profile?.role === "company") {
        router.push("/empresa/dashboard");
      } else {
        router.push("/aluno/dashboard"); // Ou vitrine se ainda não tiver dashboard
      }

    } catch (err: any) {
      setError("Email ou senha incorretos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    // Função simples de cadastro para testarmos (depois melhoramos)
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: userType } // Aqui salvamos se é aluno ou empresa
        }
      });
      if (error) throw error;
      alert("Cadastro realizado! Verifique seu email ou tente logar (se a confirmação de email estiver desligada).");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> Voltar para Home
        </Link>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Acesse a VULP</h1>
            <p className="text-gray-400 text-sm">Entre para gerenciar sua carreira ou contratar.</p>
          </div>

          {/* Seletor de Tipo (Abas) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-8">
            <button
              onClick={() => setUserType("student")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                userType === "student" 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <GraduationCap size={16} /> Sou Aluno
            </button>
            <button
              onClick={() => setUserType("company")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                userType === "company" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 size={16} /> Sou Empresa
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                userType === "student" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Entrar na Plataforma"}
            </button>
          </form>

          {/* Botão de Cadastro Rápido (para teste) */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Ainda não tem conta?</p>
            <button 
              onClick={handleSignUp}
              type="button"
              className="text-white text-sm hover:underline"
            >
              Criar conta de {userType === "student" ? "Aluno" : "Empresa"} agora
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
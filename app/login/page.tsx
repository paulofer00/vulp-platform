"use client";

import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Building2, GraduationCap, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"student" | "company">("student");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isStudent = userType === "student";
  
  // TEMA: Fundo muda, mas o Roxo (Brand) permanece nos detalhes
  const theme = {
    bg: isStudent ? "bg-[#050505]" : "bg-slate-50",
    text: isStudent ? "text-white" : "text-slate-900",
    cardBg: isStudent ? "bg-[#0A0A0A]" : "bg-white",
    cardBorder: isStudent ? "border-white/10" : "border-slate-200 shadow-xl",
    inputBg: isStudent ? "bg-white/5" : "bg-slate-100",
    inputBorder: isStudent ? "border-white/10" : "border-slate-200",
    inputText: isStudent ? "text-white" : "text-slate-900",
    iconColor: isStudent ? "text-gray-500" : "text-slate-400",
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profile?.role === "company") {
        router.push("/empresa/dashboard");
      } else {
        router.push("/aluno/dashboard");
      }

    } catch (err: any) {
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: userType } }
      });
      
      if (error) throw error;

      // LOGIN AUTOMÁTICO APÓS CADASTRO
      if (data.session) {
        if (userType === "company") {
            router.push("/empresa/dashboard");
        } else {
            router.push("/aluno/dashboard");
        }
      } else {
        alert("Conta criada! Tente fazer login.");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500`}>
      
      {/* Background Decor */}
      <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${isStudent ? 'bg-purple-900/20' : 'bg-purple-200/60'}`} />
      <div className={`absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none transition-colors duration-700 ${isStudent ? 'bg-blue-900/10' : 'bg-purple-300/40'}`} />

      <div className="w-full max-w-md relative z-10">
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-8 transition-colors ${isStudent ? 'text-gray-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}>
          <ArrowLeft size={18} /> Voltar para Home
        </Link>

        <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-8 transition-all duration-500`}>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 tracking-tight">
              {isStudent ? "Portal do Aluno" : "Portal Corporativo"}
            </h1>
            <p className={isStudent ? "text-gray-400 text-sm" : "text-slate-500 text-sm"}>
              {isStudent ? "Acesse suas aulas e conquistas." : "Gerencie vagas e contrate talentos."}
            </p>
          </div>

          {/* Abas de Seleção */}
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl mb-8 transition-colors duration-500 ${isStudent ? 'bg-white/5' : 'bg-slate-100'}`}>
            <button
              onClick={() => setUserType("student")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                isStudent
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" 
                  : "text-slate-500 hover:text-slate-800 hover:bg-white"
              }`}
            >
              <GraduationCap size={16} /> Sou Aluno
            </button>
            <button
              onClick={() => setUserType("company")}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                !isStudent
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 size={16} /> Sou Empresa
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase ml-1 transition-colors ${isStudent ? 'text-gray-500' : 'text-slate-400'}`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor}`} size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl py-4 pl-12 pr-4 ${theme.inputText} focus:outline-none focus:border-purple-500 transition-all placeholder:opacity-50`}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-xs font-bold uppercase ml-1 transition-colors ${isStudent ? 'text-gray-500' : 'text-slate-400'}`}>Senha</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.iconColor}`} size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded-xl py-4 pl-12 pr-4 ${theme.inputText} focus:outline-none focus:border-purple-500 transition-all placeholder:opacity-50`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

            {/* BOTÃO PRINCIPAL: Sempre Roxo agora */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Acessar Plataforma"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm mb-2 ${isStudent ? 'text-gray-500' : 'text-slate-400'}`}>Ainda não tem conta?</p>
            <button 
              onClick={handleSignUp}
              type="button"
              className={`text-sm hover:underline font-bold ${isStudent ? 'text-white' : 'text-purple-600'}`}
            >
              Criar conta de {isStudent ? "Aluno" : "Empresa"} agora
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
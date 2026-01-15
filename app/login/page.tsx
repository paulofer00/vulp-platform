"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importante
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Login
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    // 2. VERIFICAR QUEM É (ROTEADOR) 🔀
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

    const role = profile?.role;

    if (role === 'admin') {
        router.push("/admin"); // Manda Admin para o bunker
    } else if (role === 'company') {
        router.push("/empresa/dashboard"); // Manda Empresa para o painel dela
    } else {
        router.push("/aluno/dashboard"); // Manda Aluno para a área de aulas
    }
    
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
            <p className="text-gray-400 mt-2">Insira suas credenciais para acessar a VULP.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl space-y-6 shadow-2xl">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">E-mail</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Senha</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>

            {error && <div className="text-red-400 text-sm font-bold text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

            <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20}/> Entrar na Plataforma</>}
            </button>
        </form>
        
        <p className="text-center text-gray-500 text-sm">
            Ainda não tem conta? <Link href="/cadastro" className="text-purple-400 hover:text-purple-300 font-bold">Crie agora</Link>
        </p>
      </div>
    </div>
  );
}
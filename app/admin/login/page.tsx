"use client";

import { createBrowserClient } from "@supabase/ssr";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
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

    // 1. Tentar Login
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Credenciais inválidas.");
      setLoading(false);
      return;
    }

    // 2. Verificar se é Admin MESMO
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role !== "admin") {
      setError("Este usuário não possui privilégios administrativos.");
      await supabase.auth.signOut(); // Desloga o intruso
      setLoading(false);
      return;
    }

    // 3. Sucesso!
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-red-500/10 rounded-full mb-4 text-red-500 border border-red-500/20">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Acesso Restrito</h1>
            <p className="text-zinc-400 text-sm mt-2">Área exclusiva para administradores VULP.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="admin@vulp.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle size={16} /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Entrar no Painel"}
          </button>
        </form>

        <div className="mt-8 text-center">
            <a href="/" className="text-zinc-600 hover:text-white text-xs transition-colors">← Voltar para o site</a>
        </div>

      </div>
    </div>
  );
}
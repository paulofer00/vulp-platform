import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import AdminForm from "./AdminForm";

export default async function AdminPage() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll() { return cookieStore.getAll() } }
    }
  );

  // 1. Verificar se está logado
  const { data: { session } } = await supabase.auth.getSession();
  
  // SE NÃO TIVER LOGADO -> Manda para o Login de Admin (e não o comum)
  if (!session) {
      redirect("/admin/login");
  }

  // 2. Verificar se é ADMIN de verdade
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // SE TIVER LOGADO, MAS NÃO FOR ADMIN -> Mostra Tela de Bloqueio 🚫
  if (profile?.role !== 'admin') {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
            <ShieldAlert size={64} className="text-red-500 mb-6" />
            <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
            <p className="text-zinc-400 max-w-md mb-8">
                Seu usuário <strong>{session.user.email}</strong> não tem permissão para acessar o painel administrativo. Esta tentativa foi registrada.
            </p>
            <div className="flex gap-4">
                <Link href="/" className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full font-bold transition-colors">
                    Voltar para Home
                </Link>
                {/* Opcional: Botão de Logout para tentar outra conta */}
            </div>
        </div>
      );
  }

  // 3. Se passou pelos seguranças, mostra o formulário
  return <AdminForm />;
}
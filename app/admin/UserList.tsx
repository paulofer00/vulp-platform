"use client";

import { useEffect, useState } from "react";
import { deleteUserAsAdmin, getUsersForAdmin } from "../actions/admin";
import { BadgeCheck, Building2, GraduationCap, Loader2, RefreshCcw, Shield, Trash2 } from "lucide-react";

// O SEGREDO ESTÁ NESTA LINHA ABAIXO (export default) 👇
export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Função para carregar a lista
  async function loadUsers() {
    setLoading(true);
    const data = await getUsersForAdmin();
    setUsers(data || []); // Garante que é array, mesmo se vier null
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Função de Deletar
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;

    setDeleting(id);
    const result = await deleteUserAsAdmin(id);

    if (result.error) {
        alert("Erro ao deletar: " + result.error);
    } else {
        setUsers(users.filter(u => u.id !== id));
    }
    setDeleting(null);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl mt-8">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <BadgeCheck size={20} className="text-green-500"/> Usuários Cadastrados
        </h2>
        <button onClick={loadUsers} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">
            <Loader2 className="animate-spin mx-auto mb-2" />
            Carregando base de dados...
        </div>
      ) : (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800">
                        <th className="py-4">Nome / Identificação</th>
                        <th className="py-4">Email</th>
                        <th className="py-4">Cargo</th>
                        <th className="py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                            <td className="py-4 font-bold text-white">
                                {user.full_name}
                            </td>
                            <td className="py-4 text-slate-400">
                                {user.email}
                            </td>
                            <td className="py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                                    ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                                      user.role === 'company' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                    {user.role === 'admin' && <Shield size={10} />}
                                    {user.role === 'company' && <Building2 size={10} />}
                                    {user.role === 'student' && <GraduationCap size={10} />}
                                    {user.role}
                                </span>
                            </td>
                            <td className="py-4 text-right">
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        disabled={deleting === user.id}
                                        className="text-slate-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                                        title="Excluir Usuário"
                                    >
                                        {deleting === user.id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-slate-500">Nenhum usuário encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}
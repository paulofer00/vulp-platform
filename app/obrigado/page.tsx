import Link from "next/link";
import { CheckCircle2, MessageCircle, Home, Mail } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Luz de Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full bg-[#111] border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl">
        
        {/* Ícone de Sucesso Animado */}
        <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
            <CheckCircle2 size={80} className="text-green-500 relative z-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          Pedido <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Recebido!</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Você deu o primeiro passo para se tornar uma <strong>Raposa</strong>. Assim que o pagamento for confirmado, você receberá o acesso no seu e-mail.
        </p>

        {/* Card de Avisos */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 mb-8 text-left space-y-4 border border-white/5">
            <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 shrink-0">
                    <Mail size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white">Verifique seu E-mail</h3>
                    <p className="text-sm text-gray-400">O acesso à plataforma e o link do grupo da turma chegam por lá.</p>
                </div>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex items-start gap-4">
                <div className="bg-green-500/10 p-2 rounded-lg text-green-400 shrink-0">
                    <MessageCircle size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white">Dúvidas?</h3>
                    <p className="text-sm text-gray-400">Se não receber em 10 minutos, chame nosso suporte.</p>
                </div>
            </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
                href="/"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
                <Home size={20} />
                Voltar ao Início
            </Link>
            <Link 
                href="https://wa.me/5593991174787" // Seu número (peguei do footer)
                target="_blank"
                className="px-8 py-4 bg-[#25D366] hover:bg-[#1ebc57] text-[#003d1c] rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
            >
                <MessageCircle size={20} />
                Falar no WhatsApp
            </Link>
        </div>

      </div>

      <footer className="absolute bottom-6 text-gray-600 text-sm">
        VULP Education © 2026
      </footer>
    </div>
  );
}
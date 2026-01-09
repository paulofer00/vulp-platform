import React from 'react';
import { Play, CheckCircle, Zap, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

const VulpLandingPage = () => {
  const colors = {
    bgMain: "bg-[#050505]", 
    purpleAccent: "#7c3aed", 
    purpleGlow: "shadow-[0_0_40px_rgba(124,58,237,0.5)]",
  };

  return (
    <div className={`min-h-screen ${colors.bgMain} text-white font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden`}>
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo Real */}
          <img src="/logo-vulp-white.png" alt="VULP" className="h-8 w-auto object-contain" />
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#metodo" className="hover:text-purple-400 transition">O Método</a>
            <a href="#plataforma" className="hover:text-purple-400 transition">A Plataforma</a>
            <a href="#planos" className="hover:text-purple-400 transition">Planos</a>
          </div>
          <button className="bg-white text-black text-sm font-bold px-6 py-3 rounded-full hover:bg-purple-600 hover:text-white transition duration-300 flex items-center gap-2">
            Área do Aluno <ArrowRight size={16}/>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-700 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <span className="inline-block border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">
            A Nova Elite do Mercado
          </span>
          <h1 className="text-5xl md:text-7xl md:leading-tight font-black mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Não estude marketing. <br />
            <span className="text-white">Domine o jogo.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            A escola de empreendedorismo para quem tem pressa.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button className={`bg-purple-600 text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-purple-700 transition flex items-center justify-center gap-3 ${colors.purpleGlow}`}>
              <Zap size={20} fill="currentColor" />
              Destravar Meu Acesso VIP
            </button>
            <button className="bg-white/5 border border-white/10 text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-white/10 transition flex items-center justify-center gap-3">
              <Play size={20} />
              Ver o Manifesto VULP
            </button>
          </div>
        </div>
      </header>

      {/* DIFERENCIAIS */}
      <section id="metodo" className="py-24 relative z-20">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Por que a VULP é diferente?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp size={32} className="text-purple-500" />}
              title="Conteúdo Tático"
              description="Aulas diretas ao ponto, atualizadas semanalmente."
            />
             <FeatureCard 
              icon={<Users size={32} className="text-blue-500" />}
              title="Comunidade de Elite"
              description="Networking real com outros players."
            />
             <FeatureCard 
              icon={<Shield size={32} className="text-emerald-500" />}
              title="Ferramentas Prontas"
              description="Acesso a templates e scripts de vendas."
            />
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="planos" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-4 max-w-5xl mx-auto">
            <PricingCard 
              title="Start" 
              price="R$ 97" 
              period="/mês"
              description="Para quem quer testar."
              features={["Acesso aos cursos", "Comunidade básica", "Suporte"]}
              buttonText="Assinar Mensal"
              active={false}
            />
            <PricingCard 
              title="Pro Elite" 
              price="R$ 79" 
              period="/mês"
              subPrice="Cobrado anualmente (R$ 948)"
              description="O melhor custo-benefício."
              features={["Tudo do Start", "Mentorias Mensais", "Certificados", "Grupo VIP"]}
              buttonText="Quero o Plano Elite"
              active={true}
              badge="Mais Escolhido"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-white/10 text-center">
         <img src="/logo-vulp-white.png" alt="VULP" className="h-8 mx-auto mb-4 opacity-50 hover:opacity-100 transition" />
         <p className="text-gray-500 text-sm">© 2024 VULP Academy.</p>
      </footer>
    </div>
  );
};

// --- COMPONENTES AUXILIARES COM TIPAGEM CORRIGIDA ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition duration-300 hover:-translate-y-2 group">
    <div className="bg-black/50 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

interface ListItemProps {
  text: string;
}

const ListItem = ({ text }: ListItemProps) => (
    <li className="flex items-center gap-3">
        <CheckCircle size={20} className="text-purple-500" />
        <span className="text-gray-200">{text}</span>
    </li>
)

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  subPrice?: string; // Opcional
  description: string;
  features: string[];
  buttonText: string;
  active: boolean;
  badge?: string; // Opcional
  opacity?: boolean; // Opcional
}

const PricingCard = ({ title, price, period, subPrice, description, features, buttonText, active, badge, opacity }: PricingCardProps) => (
    <div className={`flex-1 p-8 rounded-3xl border transition duration-300 relative flex flex-col h-full
      ${active 
        ? 'bg-[#0a0a0a] border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.2)] scale-105 z-10' 
        : 'bg-[#0a0a0a] border-white/10 hover:border-white/30'}
       ${opacity ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : ''} 
    `}>
      {badge && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              {badge}
          </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 min-h-[40px]">{description}</p>
      
      <div className="mb-6">
        <div className="flex items-end gap-1">
            <span className="text-4xl font-black">{price}</span>
            <span className="text-gray-400 mb-1">{period}</span>
        </div>
        {subPrice && <p className="text-gray-500 text-xs mt-1">{subPrice}</p>}
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
             <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle size={16} className={active ? "text-purple-500 mt-0.5" : "text-gray-500 mt-0.5"} />
                {feature}
            </li>
        ))}
      </ul>

      <button className={`w-full py-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2
        ${active 
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]' 
            : 'bg-white text-black hover:bg-gray-200'}
      `}>
        {buttonText}
      </button>
    </div>
  );

export default VulpLandingPage;
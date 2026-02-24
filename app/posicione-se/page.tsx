"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  ArrowRight, Rocket, Star, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck,
  X, Target, TrendingUp, Video, CreditCard, Lock
} from "lucide-react";
import Link from "next/link";

// 👇 IMPORTS DO GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const VulpCoinScene = dynamic(() => import("@/components/VulpCoinScene"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// --- CONFIGURAÇÃO INFINITEPAY ---
const CHECKOUT_CONFIG = {
    infiniteTag: "upeup", 
    productName: "Curso Posicione-se Agora",
    price: 49700, 
};

// --- DADOS DOS ASTRONAUTAS ---
const astronauts = [
  {
    id: 1,
    name: "Beatriz Fernandes",
    title: "A Voz do Engajamento",
    role: "Influenciadora (+70k)",
    description: "Sabe exatamente como prender a atenção e transformar seguidores engajados numa comunidade fiel e compradora.",
    image: "/bea.png", 
    color: "from-pink-500 to-purple-500"
  },
  {
    id: 2,
    name: "Alarico Neto",
    title: "O Estrategista Híbrido",
    role: "Tapajós Skate Shop",
    description: "Transformou a maior loja da região numa máquina de vendas presenciais usando o poder massivo do posicionamento online.",
    image: "/alarico.png",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Nelson Jr.",
    title: "O Arquiteto Digital",
    role: "CEO Agência Up&Up",
    description: "O cérebro por trás da maior agência de marketing. Traz o método validado por grandes empresas para o seu negócio.",
    image: "/nelson.png",
    color: "from-purple-500 to-indigo-500"
  }
];

export default function PosicioneSeLP() {
  const [currentAstro, setCurrentAstro] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState(""); 

  const mainRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const nextAstro = () => setCurrentAstro((prev) => (prev + 1) % astronauts.length);
  const prevAstro = () => setCurrentAstro((prev) => (prev - 1 + astronauts.length) % astronauts.length);

  // Auto-play do Carrossel de Elite
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAstro((prev) => (prev + 1) % astronauts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setIsSuccess(false);
        setPaymentLink("");
    }, 300);
  };

  useGSAP(() => {
    gsap.from(".hero-bg img", { scale: 1.15, duration: 2.5, ease: "power2.out" });
    gsap.from(".hero-button", { y: 80, opacity: 0, duration: 1.2, delay: 0.5, ease: "back.out(1.5)" });

    gsap.from(".astro-header", {
      scrollTrigger: { trigger: ".astro-section", start: "top 80%" },
      y: 50, opacity: 0, duration: 1, ease: "power3.out"
    });

    gsap.from(".astro-card", {
      scrollTrigger: { trigger: ".astro-section", start: "top 65%" },
      y: 100, opacity: 0, scale: 0.95, duration: 1.2, ease: "power4.out"
    });

    gsap.from(".modulo-card", {
      scrollTrigger: { trigger: ".modulos-section", start: "top 75%" },
      y: 60, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)"
    });

    gsap.from(".oferta-card", {
      scrollTrigger: { trigger: ".oferta-section", start: "top 70%" },
      scale: 0.9, opacity: 0, duration: 1, ease: "power3.out"
    });
  }, { scope: mainRef });

  const generateCheckoutUrl = (leadId: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://vulp.vc";
    const items = JSON.stringify([{ name: CHECKOUT_CONFIG.productName, price: CHECKOUT_CONFIG.price, quantity: 1 }]);
    const params = new URLSearchParams({ items: items, order_nsu: leadId, redirect_url: `${baseUrl}/obrigado` });
    return `https://checkout.infinitepay.io/${CHECKOUT_CONFIG.infiniteTag}?${params.toString()}`;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        origin: "posicione-se-agora"
    };

    let leadId = `temp_${Date.now()}`;
    
    try {
        const { data: lead, error } = await supabase.from("leads").insert(data).select().single();
        if (!error && lead) { leadId = lead.id; }
    } catch (err) {
        console.error("Erro ao salvar", err);
    }

    const link = generateCheckoutUrl(leadId);
    setPaymentLink(link);
    setIsLoading(false);
    setIsSuccess(true);
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-[#02000A] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      <ParticlesBackground />

      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-[#02000A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/">
                <img src="/logo-white.png" alt="VULP" className="h-8 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <button onClick={openModal} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] text-sm">
                Garantir Vaga
            </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative w-full h-[100svh] min-h-[600px] md:min-h-[700px] flex flex-col items-center justify-end pb-12 md:pb-10 z-10">
        <div className="absolute inset-0 z-0 hero-bg">
            <img src="/posicione-se-espaco-sideral.png" alt="Desktop" className="hidden md:block w-full h-full object-cover object-top" />
            <img src="/posicione-se-espaco-sideral-mobile.png" alt="Mobile" className="block md:hidden w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#02000A]/80 via-transparent via-75% to-[#02000A] pointer-events-none" />
        </div>

        <div className="relative z-20 flex flex-col items-center w-full px-6 md:px-0 hero-button">
            <button onClick={openModal} className="bg-white text-black hover:bg-gray-200 font-black py-4 px-8 md:py-5 md:px-12 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 w-full md:w-auto">
                Quero me Posicionar <ArrowRight size={24} />
            </button>
        </div>
      </header>

      {/* --- SEÇÃO: OS 3 ASTRONAUTAS (DESIGN DE ELITE INJETADO) --- */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-transparent to-[#050212] astro-section">
        <div className="max-w-6xl mx-auto px-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Lado Esquerdo - Textos e Controles */}
                <div className="order-2 lg:order-1 flex flex-col justify-center astro-header">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
                        Os Três <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                            Astronautas
                        </span> <br/>
                        do Mercado.
                    </h2>
                    <p className="text-lg text-indigo-300 mb-8 border-l-4 border-indigo-500 pl-6 leading-relaxed">
                        Quem vai guiar a sua jornada até o topo. <br/>
                        Eles já trilharam o caminho e agora abrem a caixa-preta para si.
                    </p>
                    
                    {/* Controles de Navegação */}
                    <div className="flex items-center gap-4 mt-4">
                        <button onClick={prevAstro} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex gap-2">
                            {astronauts.map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCurrentAstro(i)}
                                    className={`h-2 rounded-full transition-all duration-500 ${i === currentAstro ? 'w-10 bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'w-2 bg-white/20 hover:bg-white/40'}`} 
                                />
                            ))}
                        </div>
                        <button onClick={nextAstro} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Lado Direito - Cartas Empilhadas 3D */}
                <div className="order-1 lg:order-2 relative h-[550px] w-full flex items-center justify-center astro-card" style={{ perspective: '1000px' }}>
                    {astronauts.map((astro, index) => (
                        <div 
                            key={astro.id}
                            className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                                index === currentAstro 
                                    ? "opacity-100 translate-x-0 rotate-0 scale-100 z-20" 
                                    : "opacity-0 translate-x-20 rotate-6 scale-90 z-0"
                            }`}
                        >
                            <div className="relative w-full h-full bg-[#0A051A] rounded-[2rem] overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-900/20 group hover:border-indigo-500/50 transition-colors flex flex-col">
                                
                                {/* Topo: Imagem + Neon */}
                                <div className="relative w-full h-[55%] overflow-hidden bg-[#050212] flex items-end justify-center">
                                    {/* Neon */}
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br ${astro.color} opacity-40 blur-[80px] rounded-full z-0 pointer-events-none group-hover:scale-110 transition-transform duration-700`} />
                                    {/* Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${astro.color} opacity-20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0 pointer-events-none`} />
                                    
                                    {/* A Foto */}
                                    <img 
                                        src={astro.image} 
                                        alt={astro.name} 
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 relative z-10" 
                                    />
                                    
                                    {/* Base escura */}
                                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0A051A] to-transparent z-20 pointer-events-none" />
                                </div>

                                {/* Base: Textos do Mentor */}
                                <div className="relative flex-1 flex flex-col items-center justify-start p-6 text-center text-white z-30 -mt-2">
                                    <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10 bg-white/5 text-gray-300`}>
                                        {astro.title}
                                    </span>
                                    <h3 className="text-3xl font-black mb-1 uppercase tracking-tight drop-shadow-lg">{astro.name}</h3>
                                    <p className={`text-sm font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${astro.color} mb-3 drop-shadow-md`}>{astro.role}</p>
                                    <p className="text-gray-400 text-sm max-w-[280px] mx-auto leading-relaxed line-clamp-3">"{astro.description}"</p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
      </section>

      {/* MODULOS SECTION */}
      <section className="py-24 relative z-10 bg-[#02000A] border-y border-white/5 modulos-section">
        <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black mb-16 text-center text-white astro-header">
                O seu plano de voo <span className="text-indigo-400">completo</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-[#0A051A] border border-white/5 hover:border-pink-500/50 transition-colors group modulo-card">
                    <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform"><Video size={28} /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Engajamento que Vende</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Com a Beatriz, vai descobrir os segredos de criação de conteúdo que geram desejo imediato. Como usar os Stories e o Feed para criar uma tribo que consome o seu produto.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#0A051A] border border-white/5 hover:border-cyan-500/50 transition-colors group modulo-card">
                    <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform"><Target size={28} /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Domínio Físico e Digital</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        O Alarico vai mostrar na prática como a Tapajós Skate Shop atrai clientes da internet diretamente para a loja física. O verdadeiro conceito de omnicanalidade para negócios locais.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#0A051A] border border-white/5 hover:border-indigo-500/50 transition-colors group modulo-card">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform"><TrendingUp size={28} /></div>
                    <h3 className="text-xl font-bold mb-3 text-white">Estrutura de Alto Valor</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        O Nelson traz a visão de agência: tráfego, gestão de marca e como posicionar o seu produto para que os clientes não peçam desconto, mas sim o seu NIB.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* OFERTA SECTION */}
      <section className="py-32 relative z-10 bg-gradient-to-t from-[#02000A] via-[#0A051A] to-[#02000A] oferta-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
            
            <div className="h-56 w-full mx-auto mb-2 relative z-20">
                <VulpCoinScene />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white relative z-30 drop-shadow-2xl">
                Pronto para a decolagem?
            </h2>
            <p className="text-xl text-gray-400 mb-10 relative z-30">
                Não é apenas um curso. É o acesso ao conhecimento daqueles que dominam o mercado digital e físico na região. 
            </p>

            <div className="bg-[#110826] border border-indigo-500/30 p-10 md:p-14 rounded-[3rem] shadow-[0_0_50px_rgba(99,102,241,0.1)] relative oferta-card z-30">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                
                <p className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-4">Investimento Único</p>
                <div className="flex justify-center items-baseline gap-2 mb-8">
                    <span className="text-6xl font-black text-white">R$ 497</span>
                    <span className="text-xl text-gray-500 font-medium">/ ou em 12x</span>
                </div>
                
                <button onClick={openModal} className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-5 px-16 rounded-full text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105">
                    Garantir Vaga Agora <Rocket size={20} />
                </button>
                
                <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" /> Vagas altamente limitadas. Pagamento seguro.
                </p>
            </div>
        </div>
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
            <div className="relative bg-[#0A051A] border border-indigo-500/20 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                            <CheckCircle2 size={40} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Registo Concluído!</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Para garantir sua vaga, finalize o pagamento seguro através da InfinitePay.
                        </p>
                        
                        {paymentLink && (
                            <Link href={paymentLink} target="_self" className="w-full bg-[#00D775] hover:bg-[#00c068] text-[#002f1a] font-black text-lg py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 mb-4">
                                <CreditCard size={20} /> Pagar com InfinitePay
                            </Link>
                        )}

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Lock size={12} /> Ambiente seguro e criptografado
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400"><Rocket size={24} /></div>
                            <h3 className="text-2xl font-bold text-white">A sua Jornada Começa Aqui</h3>
                            <p className="text-gray-400 text-sm mt-2">Preencha rapidamente para seguir para o pagamento seguro.</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                                <input name="name" type="text" placeholder="Como quer ser chamado" className="w-full bg-[#050212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                                <input name="email" type="email" placeholder="seu@melhoremail.com" className="w-full bg-[#050212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                                <input name="phone" type="tel" placeholder="(00) 00000-0000" className="w-full bg-[#050212] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                            </div>

                            <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg">
                                {isLoading ? "A preparar voo..." : "Avançar para Pagamento"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
      )}

    </div>
  );
}

// --- COMPONENTE: PARTICLES BACKGROUND (CANVAS) ---
function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            init();
        });

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;

            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > w || this.x < 0) this.speedX *= -1;
                if (this.y > h || this.y < 0) this.speedY *= -1;
            }

            draw() {
                if(!ctx) return;
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (w * h) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            if(!ctx) return;
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animate);
        }

        init();
        animate();

        return () => window.removeEventListener('resize', () => {});
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full z-0 opacity-60 pointer-events-none"
        />
    );
}
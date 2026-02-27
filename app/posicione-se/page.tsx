"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  ArrowRight, Rocket, Star, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck,
  X, Target, TrendingUp, Video, CreditCard, Lock, ChevronDown
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Matter from "matter-js";

import VideoManifesto from "@/components/VideoManifesto"; 

const VulpCoinScene = dynamic(() => import("@/components/VulpCoinScene"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const CHECKOUT_CONFIG = {
    infiniteTag: "upeup", 
    productName: "Curso Posicione-se Agora",
    price: 9090, 
};

const astronauts = [
  { id: 1, name: "Beatriz Fernandes", title: "A Voz do Engajamento", role: "Influenciadora (+70k)", description: "Sabe exatamente como prender a atenção e transformar seguidores engajados numa comunidade fiel e compradora.", image: "/bea.png", color: "from-pink-500 to-purple-500" },
  { id: 2, name: "Alarico Neto", title: "O Estrategista Híbrido", role: "Tapajós Skate Shop", description: "Transformou a maior loja da região numa máquina de vendas presenciais usando o poder massivo do posicionamento online.", image: "/alarico.png", color: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Nelson Jr.", title: "O Arquiteto Digital", role: "CEO Agência Up&Up", description: "O cérebro por trás da maior agência de marketing. Traz o método validado por grandes empresas para o seu negócio.", image: "/nelson.png", color: "from-purple-500 to-indigo-500" }
];

const courseModules = [
  { id: "01", title: "Mentalidade e Coragem", subtitle: "Quebra de Bloqueio com Beatriz Fernandes", description: "Supere a vergonha de aparecer, organize seu conteúdo e posicione-se de forma prática usando storytelling e roteirização simples.", color: "from-pink-500 to-purple-500", iconColor: "text-pink-400", lessons: ["Aula 1: Começar sem estar pronto", "Aula 2: Perdendo a vergonha", "Aula 3: Mostrar o que você faz", "Aula 4: Constância e Calendário de Postagens", "Aula 5: Criando Conexão e Interação"] },
  { id: "02", title: "Transformando Imagem em Negócio", subtitle: "Visão Prática com Alarico Neto", description: "Saia do 'eu queria' para o 'eu comecei'. Conecte propósito, valide seu negócio gastando pouco (MVP) e construa uma comunidade forte.", color: "from-blue-500 to-cyan-500", iconColor: "text-cyan-400", lessons: ["Aula 1: Você já está conectado com seu objetivo?", "Aula 2: Não tenho estrutura, como começo? (MVP)", "Aula 3: Oportunidade: buscando quem financie seu sonho", "Aula 4: Valor da marca: conexão com a comunidade", "Aula 5: Mantenha-se firme: criando raízes", "Bônus: Missão, Visão e Valores na Prática"] },
  { id: "03", title: "Execução e Operação", subtitle: "Estrutura e Escala com Nelson Jr.", description: "Trate o seu posicionamento como parte real do trabalho. Entenda onde investir e como medir resultados concretos.", color: "from-purple-500 to-indigo-500", iconColor: "text-indigo-400", lessons: ["Aula 1: Sair do anonimato: o custo de não aparecer", "Aula 2: Tratar posicionamento como parte do trabalho", "Aula 3: Não burocratizar a operação antes do resultado", "Aula 4: Quais investimentos realmente fazem sentido", "Aula 5: Como metrificar resultados do posicionamento"] }
];

const objections = [
  { num: "01", text: "Tenho vergonha de gravar vídeos e muito medo do julgamento dos outros." },
  { num: "02", text: "Não sei transformar meu objetivo pessoal em um negócio real e lucrativo." },
  { num: "03", text: "Acho que preciso de dinheiro e uma estrutura perfeita para começar." },
  { num: "04", text: "Posto de forma aleatória, seguindo dancinhas e trends, sem saber a minha missão." },
  { num: "05", text: "Sinto que o posicionamento é perda de tempo, pois não sei metrificar os resultados." }
];

const faqs = [
    { q: "O curso é online ou presencial?", a: "O formato da VULP é presencial. Acreditamos que o networking olho no olho e a energia da sala de aula forçam a sua evolução de forma muito mais rápida que vídeos gravados." },
    { q: "Preciso já ter uma empresa estruturada?", a: "Não. No Módulo 2, o Alarico vai te ensinar exatamente como começar do zero testando um Produto Mínimo Viável (MVP) com pouquíssimo ou nenhum investimento." },
    { q: "E se eu tiver muita vergonha de aparecer?", a: "O Módulo 1 inteiro, comandado pela Beatriz Fernandes, é dedicado a destravar esse medo. Você aprenderá técnicas de roteirização e gravação em partes para perder a inibição sem pressão." },
    { q: "Quais as formas de pagamento?", a: "Você pode parcelar o valor em até 12x no cartão de crédito através do nosso checkout 100% seguro pela InfinitePay. Também aceitamos Pix." }
];

function FloatingObjections() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0, scale: 0 } });
    engineRef.current = engine;
    const world = engine.world;

    const cw = sceneRef.current.clientWidth;
    const ch = sceneRef.current.clientHeight;

    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? 260 : 300;
    const cardHeight = isMobile ? 160 : 180;

    const getAnchorPosition = (index: number) => {
        if (isMobile) {
            return { x: cw / 2, y: (ch / 6) * (index + 1) };
        } else {
            const colLeft = cw * 0.25;
            const colRight = cw * 0.75;
            const colCenter = cw * 0.5;
            const row1 = ch * 0.22;
            const row2 = ch * 0.52;
            const row3 = ch * 0.82;
            const positions = [
                { x: colLeft, y: row1 }, { x: colRight, y: row1 },
                { x: colLeft, y: row2 }, { x: colRight, y: row2 },
                { x: colCenter, y: row3 }
            ];
            return positions[index];
        }
    };

    const cardBodies: Matter.Body[] = [];
    const constraints: Matter.Constraint[] = [];

    objections.forEach((_, i) => {
        const anchor = getAnchorPosition(i);
        const body = Matter.Bodies.rectangle(anchor.x, anchor.y, cardWidth, cardHeight, {
            restitution: 0.6, frictionAir: 0.05, friction: 0, inertia: Infinity, chamfer: { radius: 16 }, render: { visible: false }
        });
        cardBodies.push(body);

        const constraint = Matter.Constraint.create({
            pointA: anchor, bodyB: body, stiffness: 0.002, damping: 0.1, render: { visible: false }
        });
        constraints.push(constraint);
    });

    Matter.Composite.add(world, [...cardBodies, ...constraints]);

    Matter.Events.on(engine, 'beforeUpdate', () => {
        const time = engine.timing.timestamp * 0.0015;
        cardBodies.forEach((body, index) => {
            const forceX = Math.sin(time + index) * 0.00015 * body.mass;
            const forceY = Math.cos(time * 1.2 + index) * 0.00015 * body.mass;
            Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY });
        });
    });

    Matter.Events.on(engine, 'afterUpdate', () => {
        cardBodies.forEach((body, i) => {
            if (cardsRef.current[i]) {
                const x = body.position.x - (cardWidth / 2);
                const y = body.position.y - (cardHeight / 2);
                cardsRef.current[i]!.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
        Matter.World.clear(world, false);
    };
  }, []);

  return (
    <div ref={sceneRef} className="relative w-full h-[700px] lg:h-[750px] mt-8 lg:mt-0 pointer-events-none">
      {objections.map((obj, i) => (
        <div key={i} ref={(el) => { cardsRef.current[i] = el; }} className="absolute top-0 left-0 w-[260px] md:w-[300px] bg-[#110826] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl pointer-events-auto hover:border-yellow-500/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-colors">
          <span className="text-4xl md:text-5xl font-black text-white/10 block mb-2 pointer-events-none">{obj.num}</span>
          <p className="text-gray-300 font-medium leading-relaxed pointer-events-none text-sm md:text-base">{obj.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function PosicioneSeLP() {
  const [currentAstro, setCurrentAstro] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState(""); 
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const nextAstro = () => setCurrentAstro((prev) => (prev + 1) % astronauts.length);
  const prevAstro = () => setCurrentAstro((prev) => (prev - 1 + astronauts.length) % astronauts.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAstro((prev) => (prev + 1) % astronauts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { setIsSuccess(false); setPaymentLink(""); }, 300);
  };

  useGSAP(() => {
    gsap.from(".hero-bg img", { scale: 1.15, duration: 2.5, ease: "power2.out" });
    gsap.from(".hero-button", { y: 80, opacity: 0, duration: 1.2, delay: 0.5, ease: "back.out(1.5)" });
    gsap.from(".boa-noticia", { scrollTrigger: { trigger: ".boa-noticia-section", start: "top 80%" }, scale: 0.95, opacity: 0, duration: 1, ease: "back.out(1.2)" });

    gsap.to(".timeline-progress", {
      scrollTrigger: { trigger: ".timeline-section", start: "top center", end: "bottom center", scrub: 1 }, height: "100%", ease: "none"
    });

    const modules = gsap.utils.toArray('.timeline-module');
    modules.forEach((mod: any) => {
      gsap.from(mod, { scrollTrigger: { trigger: mod, start: "top 75%" }, x: 50, opacity: 0, duration: 0.8, ease: "back.out(1.2)" });
    });

    gsap.from(".astro-header", { scrollTrigger: { trigger: ".astro-section", start: "top 80%" }, y: 50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".astro-card", { scrollTrigger: { trigger: ".astro-section", start: "top 65%" }, y: 100, opacity: 0, scale: 0.95, duration: 1.2, ease: "power4.out" });
    gsap.from(".oferta-card", { scrollTrigger: { trigger: ".oferta-section", start: "top 70%" }, scale: 0.9, opacity: 0, duration: 1, ease: "power3.out" });
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
    } catch (err) { console.error("Erro ao salvar", err); }

    const link = generateCheckoutUrl(leadId);
    setPaymentLink(link);
    setIsLoading(false);
    setIsSuccess(true);
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-[#02000A] text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      <ParticlesBackground />

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

      <section className="py-24 px-6 relative z-10 bg-[#02000A]">
        <div className="max-w-5xl mx-auto">
            <VideoManifesto />
        </div>
      </section>

      {/* OBJEÇÕES */}
      {/* 🛑 A COR FOI AJUSTADA AQUI: A secção termina em #0A051A para ligar com a próxima 🛑 */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-[#02000A] to-[#0A051A] obj-section">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-2">
                    <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
                        Se você se identifica com pelo menos uma dessas frases, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">essa formação é pra você.</span>
                    </h2>
                    <p className="text-gray-400 text-lg">As dúvidas do mercado batem, mas você não precisa parar por causa delas.</p>
                </div>
                <div className="lg:col-span-3">
                    <FloatingObjections />
                </div>
            </div>
        </div>
      </section>

      {/* BOA NOTÍCIA (COM DEGRADÊS DUPLOS NO TOPO E NA BASE) */}
      <section className="relative z-10 min-h-[500px] md:min-h-[600px] flex items-center py-24 boa-noticia-section overflow-hidden bg-[#0A051A]">
        <div className="absolute inset-0 z-0">
            <img src="/posicionese-pegada.png" alt="Pegada na Lua" className="w-full h-full object-cover object-center md:object-right opacity-90" />
        </div>
        
        {/* Degradê horizontal da esquerda para a direita (esconde o fundo da imagem sob o texto) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A051A] via-[#0A051A]/95 via-50% md:via-40% to-transparent" />
        
        {/* 🛑 ESMAECIMENTO SUPERIOR: Mistura perfeitamente com a secção de objeções acima 🛑 */}
        <div className="absolute top-0 left-0 w-full h-32 md:h-48 bg-gradient-to-b from-[#0A051A] via-[#0A051A]/80 to-transparent z-10 pointer-events-none" />
        
        {/* 🛑 ESMAECIMENTO INFERIOR: Mergulha no preto #02000A da Ponte da Lua abaixo 🛑 */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#02000A] via-[#02000A]/80 to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
            <div className="w-full lg:w-1/2 p-4 md:p-8 boa-noticia">
                <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 leading-tight">
                    A boa notícia:
                </h2>
                <h3 className="text-xl md:text-3xl font-bold text-white mb-8 leading-snug">
                    Dá pra mudar tudo isso em uma formação desenhada para a execução.
                </h3>
                <div className="space-y-5 mb-10">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-500/10 p-2 rounded-lg shrink-0 mt-1"><X className="text-red-500" size={20} /></div>
                        <p className="text-gray-300 text-lg leading-relaxed">Sem fórmula mágica, dancinhas constrangedoras ou teorias de palco que não funcionam na vida real.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-green-500/10 p-2 rounded-lg shrink-0 mt-1"><CheckCircle2 className="text-[#00D775]" size={20} /></div>
                        <p className="text-gray-300 text-lg leading-relaxed">Com posicionamento intencional, execução validada (MVP) e a bagagem de quem já construiu marcas fortes no mercado local.</p>
                    </div>
                </div>
                <button onClick={openModal} className="w-full sm:w-auto bg-[#00D775] hover:bg-[#00c068] text-[#002f1a] font-black text-lg py-4 px-10 rounded-full shadow-[0_0_20px_rgba(0,215,117,0.3)] transition-transform hover:scale-105 flex items-center justify-center gap-3">
                    Quero garantir minha vaga! <Rocket size={20} />
                </button>
            </div>
        </div>
      </section>

      {/* 👇 A PONTE DE TRANSIÇÃO (AGORA MAIS ALTA E COM VIGNETTE GIGANTE) 👇 */}
      {/* 🛑 Aumentei para h-[80vh] para tirar o zoom e revelar o topo da imagem 🛑 */}
      <section className="relative w-full h-[50vh] md:h-[80vh] min-h-[400px] z-10 bg-[#02000A] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
            <img src="/posicionese-agora-Lua.jpg" alt="Posicione-se Agora na Lua" className="w-full h-full object-cover object-center" />
        </div>
        
        {/* 🛑 FADE GIGANTE NO TOPO (Ocupa 50% da altura da secção) 🛑 */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#02000A] via-[#02000A]/80 to-transparent z-10 pointer-events-none" />
        
        {/* 🛑 FADE GIGANTE NA BASE (Mergulha a lua no infinito para os Módulos) 🛑 */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#02000A] via-[#02000A]/95 to-transparent z-10 pointer-events-none" />
      </section>

      {/* TIMELINE DE MÓDULOS */}
      <section className="pb-24 pt-10 relative z-10 bg-[#02000A] timeline-section">
        <div className="max-w-4xl mx-auto px-6 relative">
            <h2 className="text-3xl md:text-5xl font-black mb-20 text-center text-white">
                O seu plano de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">voo completo</span>
            </h2>
            
            <div className="relative">
                <div className="absolute left-[24px] md:left-[24px] top-4 bottom-0 w-1 bg-white/5 rounded-full" />
                <div className="absolute left-[24px] md:left-[24px] top-4 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full timeline-progress h-0 z-0" />
                
                <div className="space-y-16">
                    {courseModules.map((mod) => (
                        <div key={mod.id} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 timeline-module">
                            <div className="w-12 h-12 shrink-0 rounded-full bg-[#0A051A] border-2 border-indigo-500 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] relative z-20 self-start md:mt-6">
                                {mod.id}
                            </div>
                            <div className="flex-1 bg-[#0A051A] border border-white/5 rounded-3xl p-6 md:p-10 hover:border-indigo-500/30 transition-all duration-300 shadow-xl ml-12 md:ml-0 -mt-16 md:-mt-0">
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{mod.title}</h3>
                                <h4 className={`text-sm md:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r ${mod.color} mb-4`}>
                                    {mod.subtitle}
                                </h4>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">{mod.description}</p>
                                <div className="space-y-3">
                                    {mod.lessons.map((lesson, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${mod.iconColor}`} />
                                            <span className="text-sm font-medium text-gray-300">{lesson}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <section className="py-24 relative z-10 bg-gradient-to-b from-[#02000A] to-[#050212] astro-section">
        <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 flex flex-col justify-center astro-header">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight">
                        Os Três <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Astronautas</span> <br/>
                        do Mercado.
                    </h2>
                    <p className="text-lg text-indigo-300 mb-8 border-l-4 border-indigo-500 pl-6 leading-relaxed">Quem vai guiar a sua jornada até o topo. <br/> Eles já trilharam o caminho e agora abrem a caixa-preta para si.</p>
                    <div className="flex items-center gap-4 mt-4">
                        <button onClick={prevAstro} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"><ChevronLeft size={24} /></button>
                        <div className="flex gap-2">
                            {astronauts.map((_, i) => (
                                <button key={i} onClick={() => setCurrentAstro(i)} className={`h-2 rounded-full transition-all duration-500 ${i === currentAstro ? 'w-10 bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'w-2 bg-white/20 hover:bg-white/40'}`} />
                            ))}
                        </div>
                        <button onClick={nextAstro} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"><ChevronRight size={24} /></button>
                    </div>
                </div>

                <div className="order-1 lg:order-2 relative h-[550px] w-full flex items-center justify-center astro-card" style={{ perspective: '1000px' }}>
                    {astronauts.map((astro, index) => (
                        <div key={astro.id} className={`absolute inset-0 transition-all duration-700 ease-out transform ${index === currentAstro ? "opacity-100 translate-x-0 rotate-0 scale-100 z-20" : "opacity-0 translate-x-20 rotate-6 scale-90 z-0"}`}>
                            <div className="relative w-full h-full bg-[#0A051A] rounded-[2rem] overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-900/20 group hover:border-indigo-500/50 transition-colors flex flex-col">
                                <div className="relative w-full h-[55%] overflow-hidden bg-[#050212] flex items-end justify-center">
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br ${astro.color} opacity-40 blur-[80px] rounded-full z-0 pointer-events-none group-hover:scale-110 transition-transform duration-700`} />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${astro.color} opacity-20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0 pointer-events-none`} />
                                    <img src={astro.image} alt={astro.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 relative z-10" />
                                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0A051A] to-transparent z-20 pointer-events-none" />
                                </div>
                                <div className="relative flex-1 flex flex-col items-center justify-start p-6 text-center text-white z-30 -mt-2">
                                    <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-white/10 bg-white/5 text-gray-300`}>{astro.title}</span>
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

      <section className="py-32 relative z-10 bg-gradient-to-t from-[#050212] via-[#0A051A] to-[#02000A] oferta-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="h-56 w-full mx-auto mb-2 relative z-20"><VulpCoinScene /></div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white relative z-30 drop-shadow-2xl">Pronto para a decolagem?</h2>
            <p className="text-xl text-gray-400 mb-10 relative z-30">Não é apenas um curso. É o acesso ao conhecimento daqueles que dominam o mercado digital e físico.</p>
            <div className="bg-[#110826] border border-indigo-500/30 p-10 md:p-14 rounded-[3rem] shadow-[0_0_50px_rgba(99,102,241,0.1)] relative oferta-card z-30">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                <p className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-4">Investimento Único</p>
                <div className="flex justify-center items-baseline gap-2 mb-8">
                    <span className="text-6xl font-black text-white">R$ 90,90</span><span className="text-xl text-gray-500 font-medium">/ à vista!</span>
                </div>
                <button onClick={openModal} className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-5 px-16 rounded-full text-xl shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105">
                    Garantir Vaga Agora <Rocket size={20} />
                </button>
                <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Vagas altamente limitadas. Pagamento seguro.</p>
            </div>
        </div>
      </section>

      <section className="py-24 relative z-10 bg-[#02000A] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-center text-white">Perguntas Frequentes</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-[#0A051A] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                        <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors">
                            <span className="font-bold text-lg text-white">{faq.q}</span>
                            <ChevronDown className={`text-indigo-500 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* MODAL CHECKOUT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
            <div className="relative bg-[#0A051A] border border-indigo-500/20 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20"><CheckCircle2 size={40} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" /></div>
                        <h3 className="text-2xl font-bold text-white mb-2">Registo Concluído!</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">Para garantir sua vaga, finalize o pagamento seguro através da InfinitePay.</p>
                        {paymentLink && (
                            <Link href={paymentLink} target="_self" className="w-full bg-[#00D775] hover:bg-[#00c068] text-[#002f1a] font-black text-lg py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 mb-4">
                                <CreditCard size={20} /> Pagar com InfinitePay
                            </Link>
                        )}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500"><Lock size={12} /> Ambiente seguro e criptografado</div>
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
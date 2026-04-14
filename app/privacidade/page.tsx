import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | VULP",
  description: "Política de Privacidade e termos de uso da plataforma VULP.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#02000A] text-gray-300 font-sans selection:bg-indigo-500/30 p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-[#0A051A] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-10 font-medium bg-white/5 px-4 py-2 rounded-full text-sm border border-white/10 w-fit">
          <ArrowLeft size={16} /> Voltar para o site
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Política de Privacidade</h1>
        </div>

        <div className="space-y-6 leading-relaxed text-sm md:text-base text-gray-400">
          <p>
            A sua privacidade é importante para nós. É política do Vulp respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Vulp, e outros sites que possuímos e operamos.
          </p>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
          </p>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
          </p>
          <p>
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
          </p>
          <p>
            O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
          </p>
          <p>
            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
          </p>
          <p>
            O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
            Anúncios e Cookies
          </h2>
          <p>
            O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você. Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense.
          </p>
          <p>
            Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental usados por este site foram projetados para garantir que você forneça os anúncios mais relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando coisas semelhantes que possam ser do seu interesse.
          </p>
          <p>
            Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que pode fornecê-lo para fazer uma compra.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
            Compromisso do Usuário
          </h2>
          <p>
            O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Vulp oferece no site e com caráter enunciativo, mas não limitativo:
          </p>
          <ul className="list-none space-y-4 mt-4">
            <li className="flex items-start gap-3 bg-[#110826] p-4 rounded-xl border border-white/5">
              <strong className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md text-xs">A)</strong> 
              <span className="mt-0.5">Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</span>
            </li>
            <li className="flex items-start gap-3 bg-[#110826] p-4 rounded-xl border border-white/5">
              <strong className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md text-xs">B)</strong> 
              <span className="mt-0.5">Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</span>
            </li>
            <li className="flex items-start gap-3 bg-[#110826] p-4 rounded-xl border border-white/5">
              <strong className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded-md text-xs">C)</strong> 
              <span className="mt-0.5">Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Vulp, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full inline-block"></span>
            Mais informações
          </h2>
          <p>
            Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
          </p>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-medium">
              Esta política é efetiva a partir de <strong className="text-gray-400">14 de Abril de 2026</strong>.
            </p>
            <img src="/logo-white.png" alt="VULP" className="h-6 opacity-30 grayscale" />
          </div>

        </div>
      </div>
    </div>
  );
}
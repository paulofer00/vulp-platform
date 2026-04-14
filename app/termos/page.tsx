import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Termos e Condições | VULP",
  description: "Termos e Condições de uso da plataforma VULP.",
};

export default function TermsAndConditions() {
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
            <FileText size={32} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Termos e Condições</h1>
        </div>

        <div className="space-y-8 leading-relaxed text-sm md:text-base text-gray-400">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
              1. Termos
            </h2>
            <p className="mb-4">
              Ao acessar ao site Vulp, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
              2. Uso de Licença
            </h2>
            <p className="mb-4">
              É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Vulp, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-400">
              <li>modificar ou copiar os materiais;</li>
              <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
              <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Vulp;</li>
              <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais;</li>
              <li>ou transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
            </ul>
            <p>
              Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Vulp a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-pink-500 rounded-full inline-block"></span>
              3. Isenção de responsabilidade
            </h2>
            <p className="mb-4">
              Os materiais no site da Vulp são fornecidos 'como estão'. Vulp não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            </p>
            <p>
              Além disso, o Vulp não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              4. Limitações
            </h2>
            <p>
              Em nenhum caso o Vulp ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Vulp, mesmo que Vulp ou um representante autorizado da Vulp tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-green-500 rounded-full inline-block"></span>
              5. Precisão dos materiais
            </h2>
            <p>
              Os materiais exibidos no site da Vulp podem incluir erros técnicos, tipográficos ou fotográficos. Vulp não garante que qualquer material em seu site seja preciso, completo ou atual. Vulp pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Vulp não se compromete a atualizar os materiais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-500 rounded-full inline-block"></span>
              6. Links e Modificações
            </h2>
            <p className="mb-4">
              O Vulp não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Vulp do site. O uso de qualquer site vinculado é por conta e risco do usuário.
            </p>
            <p>
              O Vulp pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-400 rounded-full inline-block"></span>
              Lei aplicável
            </h2>
            <p>
              Estes termos e condições são regidos e interpretados de acordo com as leis do Vulp e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-white/10 flex justify-center opacity-30">
            <img src="/logo-white.png" alt="VULP" className="h-6 grayscale" />
          </div>

        </div>
      </div>
    </div>
  );
}
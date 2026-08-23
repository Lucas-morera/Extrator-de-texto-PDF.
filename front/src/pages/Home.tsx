import { Navbar } from '../pages/navbar/Navbar';

export function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo: Textos de Apresentação */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-indigo-950/80 text-indigo-400 border border-indigo-800/50 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              FERRAMENTA LOCAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Extrator de texto <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                de PDF
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Processado inteiramente no seu navegador — nenhum arquivo sai da sua máquina. Extração rápida, segura e sem limites.
            </p>

            {/* Badges Visuais */}
            <div className="pt-4 flex flex-wrap gap-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium text-slate-300">100% Local</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-sm font-medium text-slate-300">Sem upload para nuvem</span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Apenas Visual e Botão de Redirecionamento (Sem Formulário) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none flex flex-col justify-center">
            <div className="bg-[#0b0f19] p-10 rounded-2xl border border-slate-800/80 shadow-2xl shadow-indigo-950/20 relative overflow-hidden flex flex-col items-center text-center">
              {/* Linha Glowing no topo do card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

              {/* Ícone de destaque */}
              <div className="w-20 h-20 mb-6 rounded-full bg-indigo-950/40 flex items-center justify-center border border-indigo-500/20">
                <svg 
                  className="w-10 h-10 text-indigo-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Pronto para extrair?
              </h2>
              
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Acesse a ferramenta agora. É totalmente grátis e não requer nenhum tipo de cadastro ou instalação.
              </p>

              {/* Botão que leva para a rota solicitada */}
              <a 
                href="/extrair_texto" 
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Acessar Ferramenta
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>

            </div>
          </div>

        </div>

        {/* Rodapé de Features puramente visual */}
        <div className="mt-20 pt-10 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0b0f19] p-5 rounded-xl border border-slate-800/60">
            <div className="text-indigo-400 font-bold mb-1 text-sm">🔒 Privacidade Absoluta</div>
            <p className="text-xs text-slate-400 leading-relaxed">Nenhum dado trafega por servidores externos. Tudo é executado localmente.</p>
          </div>
          <div className="bg-[#0b0f19] p-5 rounded-xl border border-slate-800/60">
            <div className="text-indigo-400 font-bold mb-1 text-sm">⚡ Extração Imediata</div>
            <p className="text-xs text-slate-400 leading-relaxed">Leitura nativa do documento para resposta instantânea direto no navegador.</p>
          </div>
          <div className="bg-[#0b0f19] p-5 rounded-xl border border-slate-800/60">
            <div className="text-indigo-400 font-bold mb-1 text-sm">📄 Formato Limpo</div>
            <p className="text-xs text-slate-400 leading-relaxed">O texto é extraído de forma estruturada, pronto para você copiar e usar.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
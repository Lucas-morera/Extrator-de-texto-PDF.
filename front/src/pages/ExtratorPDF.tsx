import { useCallback, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Navbar } from '../pages/navbar/Navbar';
import Swal from 'sweetalert2';
import {salvarTexto} from '../services/api';

// Necessário apontar para o worker do pdf.js.
// Nas versões mais novas o worker é .mjs (módulo ES), não .js.
// Usamos jsdelivr porque ele sempre tem a MESMA versão que está no seu node_modules.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type Estado = "vazio" | "processando" | "pronto" | "erro";

export function ExtratorPDF() {
  const [estado, setEstado] = useState<Estado>("vazio");
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dadosString = sessionStorage.getItem("usuario");
  const usuario = dadosString ? JSON.parse(dadosString) : null;

  if (usuario) {
    console.log("E-mail:", usuario.email);
    console.log("Nome:", usuario.nome);
    console.log("Cidade:", usuario.cidade);
  }else {
  Swal.fire({
    icon: 'warning',
    title: 'Acesso Restrito',
    text: 'Para usar o recurso precisa fazer o login.',
    background: '#0f1424',
    color: '#fff',
    confirmButtonText: 'OK', // Texto do botão
    confirmButtonColor: '#6366f1',
    showConfirmButton: true, // Garante que o botão apareça
    allowOutsideClick: false // Impede que a pessoa feche clicando fora sem apertar OK
  }).then((result) => {
    // Esse código SÓ roda DEPOIS que o usuário clica no botão OK!
    if (result.isConfirmed) {
      window.location.href = "/";
    }
  });
}

  async function extrairTexto(arquivo: File) {
    setEstado("processando");
    setErro("");
    setTexto("");
    setNomeArquivo(arquivo.name);

    try {
      const arrayBuffer = await arquivo.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPaginas(pdf.numPages);

      let textoCompleto = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const textoPagina = content.items
          .map((item: any) => item.str)
          .join(" ");

        textoCompleto += `--- Página ${i} ---\n${textoPagina}\n\n`;
      }

      setTexto(textoCompleto.trim());
      setEstado("pronto");

     const request_api = await salvarTexto(textoCompleto.trim(),usuario.id);
      console.log(request_api);
      if(request_api){
         Swal.fire({
        icon: 'success',
        title: 'Seus dados foram gravados!',
        text: 'O texto extraído foi salvo no banco de dados !',
        background: '#0f1424',
        color: '#fff',
        confirmButtonText: 'OK', // Texto do botão
        confirmButtonColor: '#6366f1',
        showConfirmButton: true, // Garante que o botão apareça
        allowOutsideClick: false // Impede que a pessoa feche clicando fora sem apertar OK
      })
      }

    } catch (err) {
      console.error(err);
      setErro("Não foi possível extrair o texto deste PDF. Verifique se o arquivo não está corrompido.");
      setEstado("erro");
    }
  }

  function processarArquivo(arquivo: File | undefined) {
    if (!arquivo) return;
    if (arquivo.type !== "application/pdf") {
      setErro("Esse arquivo não é um PDF. Selecione um arquivo .pdf.");
      setEstado("erro");
      return;
    }
    extrairTexto(arquivo);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    processarArquivo(e.target.files?.[0]);
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setArrastando(false);
    processarArquivo(e.dataTransfer.files?.[0]);
  }, []);

  function reiniciar() {
    setEstado("vazio");
    setTexto("");
    setErro("");
    setNomeArquivo("");
    setTotalPaginas(0);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function copiarTexto() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  function baixarTxt() {
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nomeArquivo.replace(/\.pdf$/i, "")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase">
            Ferramenta local
          </p>
          <h1 className="text-2xl font-semibold text-white mt-1">
            Extrator de texto de PDF
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Processado inteiramente no seu navegador — nenhum arquivo sai da sua máquina.
          </p>
        </div>

        {/* Área de upload */}
        {estado !== "pronto" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              rounded-xl border-2 border-dashed p-10 text-center cursor-pointer
              transition-colors duration-150
              ${arrastando ? "border-indigo-400 bg-indigo-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-600"}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {estado === "processando" ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-indigo-400 animate-spin" />
                <p className="text-sm text-slate-300">
                  Extraindo texto de <span className="font-medium text-white">{nomeArquivo}</span>...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="h-8 w-8 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9m0 0-3 3m3-3 3 3M6.75 19.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <p className="text-sm text-slate-300">
                  Arraste um PDF aqui ou{" "}
                  <span className="text-indigo-400 font-medium">clique para selecionar</span>
                </p>
                <p className="text-xs text-slate-500">Apenas arquivos .pdf</p>
              </div>
            )}
          
          </div>
        )}

        {/* Erro */}
        {estado === "erro" && (
          <div className="mt-4 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3">
            <p className="text-sm text-red-300">{erro}</p>
            <button
              onClick={reiniciar}
              className="mt-2 text-xs font-medium text-red-300 underline underline-offset-2 hover:text-red-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Resultado */}
        {estado === "pronto" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{nomeArquivo}</p>
                <p className="text-xs text-slate-500">
                  {totalPaginas} {totalPaginas === 1 ? "página" : "páginas"} · {texto.length.toLocaleString("pt-BR")} caracteres
                </p>
              </div>
              <button
                onClick={reiniciar}
                className="shrink-0 text-xs font-medium text-slate-400 hover:text-white px-2 py-1"
              >
                Novo arquivo
              </button>
            </div>

            <textarea
              value={texto}
              readOnly
              rows={16}
              className="w-full bg-slate-950 text-slate-200 text-sm font-mono px-4 py-3 resize-y focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500"
            />

            <div className="flex gap-2 px-4 py-3 border-t border-slate-800">
              <button
                onClick={copiarTexto}
                className="text-sm font-medium px-3 py-1.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-400 transition-colors"
              >
                {copiado ? "Copiado!" : "Copiar texto"}
              </button>
              <button
                onClick={baixarTxt}
                className="text-sm font-medium px-3 py-1.5 rounded-md border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Baixar .txt
              </button>
            </div>
          </div>
        )}
       
        <a href="/meus_pdfs" 
        className="mt-10 group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200">
  <div className="flex items-center gap-3">
    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
      {/* Ícone de PDF */}
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        Todos os meus PDFs extraídos
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Clique para visualizar e gerenciar os arquivos
      </p>
    </div>
  </div>
  
  {/* Seta indicativa */}
  <svg className=" w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
</a>

      </div>
    </div>
    </div>      
  );
}
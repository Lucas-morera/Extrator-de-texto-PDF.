import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import { Navbar } from "../pages/navbar/Navbar";
import Swal from "sweetalert2";
import { meusPDFS } from "../services/api"; // Importando direto do arquivo de serviços

interface PdfAnaliseRow {
  id: number;
  userId: number;
  pdfExtract: string | null;
  data: string;
  active: boolean;
  analiseIa: string | null;
}

const Icon = ({ d, extra }: { d: string; extra?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    {extra && <path d={extra} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

const FileIcon = () => <Icon d="M6 2.5h8l4.5 4.5V21a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" extra="M14 2.5V7h4.5" />;
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const TrashIcon = () => <Icon d="M4 7h16M9.5 7V4.8c0-.44.36-.8.8-.8h3.4c.44 0 .8.36.8.8V7M6.5 7l.9 12.2c.05.6.55 1.1 1.16 1.1h6.88c.6 0 1.1-.5 1.16-1.1L17.5 7" />;
const SearchIcon = () => <Icon d="M21 21l-4.3-4.3" extra="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" />;

const customStyles = {
  headRow: { style: { backgroundColor: "transparent", borderBottomColor: "var(--b)", minHeight: "44px" } },
  headCells: { style: { fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--muted)", fontWeight: 600 } },
  rows: { style: { minHeight: "56px", fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "var(--text)", backgroundColor: "var(--card)", borderBottomColor: "var(--b)", "&:hover": { backgroundColor: "var(--hover)" } } },
  pagination: { style: { borderTopColor: "var(--b)", color: "var(--muted)", backgroundColor: "var(--card)", fontFamily: "'Inter',sans-serif", fontSize: "13px" } },
};

export function MeusPDFS() {
  const [analises, setAnalises] = useState<PdfAnaliseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVisualizar = (row: PdfAnaliseRow) => {
    Swal.fire({
      title: `Análise ID: ${row.id}`,
      html: `<div style="text-align: left; max-height: 300px; overflow-y: auto;">
        <p><b>Data:</b> ${new Date(row.data).toLocaleString()}</p>
        <p><b>Extrato:</b> ${row.pdfExtract || "N/A"}</p>
        <p><b>Análise IA:</b> ${row.analiseIa || "Pendente / Nenhuma"}</p>
      </div>`,
      width: '600px',
      confirmButtonText: "Fechar"
    });
  };

  const handleExcluir = async (row: PdfAnaliseRow) => {
    const c = await Swal.fire({ title: `Excluir registro #${row.id}?`, icon: "warning", showCancelButton: true, confirmButtonText: "Sim, excluir", cancelButtonText: "Cancelar" });
    if (c.isConfirmed) {
      setAnalises((p) => p.filter((x) => x.id !== row.id));
      Swal.fire("Excluído!", "", "success");
    }
  };

  const processarArquivo = async (arquivo: File) => {
    try {
      const buffer = await arquivo.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      const texto = textContent.items.map((i: any) => i.str).join(" ");
      console.log(texto);
      
      Swal.fire("Sucesso", "PDF processado e enviado.", "success").then(() => {
        // Recarrega a página ao concluir o upload/processamento se desejado
        window.location.reload();
      });
    } catch {
      Swal.fire("Erro", "Falha ao processar o PDF.", "error");
    }
  };

  const carregarAnalises = useCallback(async () => {
    setLoading(true);
    try {
      // Substitua pelo ID do usuário logado correspondente
    
      // alert(JSON.parse(sessionStorage.getItem("usuario") || "{}").id );
      const idUsuarioLogado = JSON.parse(sessionStorage.getItem("usuario") || "{}").id ; 
      const data = await meusPDFS(idUsuarioLogado);
      setAnalises(data);
    } catch {
      Swal.fire("Erro", "Não foi possível carregar os dados dos PDFs.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAnalises();
  }, [carregarAnalises]);

  const handleArquivoSelecionado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await processarArquivo(f);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") await processarArquivo(f);
  };

  const colunas: TableColumn<PdfAnaliseRow>[] = [
    {
      name: "ID / Extrato",
      selector: (r) => r.pdfExtract || "",
      sortable: true,
      grow: 2,
      cell: (r) => (
        <div className="pdfm-file-cell">
          <span className="pdfm-file-icon" style={{ color: "#7C86FF" }}><FileIcon /></span>
          <div>
            <span className="pdfm-file-name">Análise #{r.id}</span>
            <div className="pdfm-mono" style={{ fontSize: "11px", maxWidth: "250px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {r.pdfExtract || "Sem texto extraído"}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Data de Envio",
      selector: (r) => r.data,
      sortable: true,
      cell: (r) => <span className="pdfm-mono">{new Date(r.data).toLocaleDateString()} {new Date(r.data).toLocaleTimeString()}</span>,
    },
    {
      name: "Análise da IA",
      selector: (r) => r.analiseIa || "",
      sortable: true,
      cell: (r) => (
        <span className="pdfm-mono" style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {r.analiseIa || "Aguardando..."}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (r) => r.active,
      sortable: true,
      cell: (r) => (
        <span className={`pdfm-pill ${r.active ? 'active' : 'inactive'}`} style={{ color: r.active ? "#8FE3B0" : "#F29C98", backgroundColor: r.active ? "rgba(52,199,132,0.14)" : "rgba(224,107,101,0.16)" }}>
          {r.active ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      name: "Ações",
      width: "96px",
      cell: (r) => (
        <div className="pdfm-actions">
          <button className="pdfm-icon-btn" title="Visualizar" onClick={() => handleVisualizar(r)}><EyeIcon /></button>
          <button className="pdfm-icon-btn pdfm-icon-btn-danger" title="Excluir" onClick={() => handleExcluir(r)}><TrashIcon /></button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const analisesFiltradas = analises.filter((p) => (p.pdfExtract && p.pdfExtract.toLowerCase().includes(filtro.toLowerCase())) || String(p.id).includes(filtro));

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');
        .pdfm-wrap { --bg:#05070F; --card:#0C1020; --b:#1B2036; --text:#E8E9F2; --muted:#7C8299; --hover:#12162A; --accent:#7C86FF; --accent-hover:#9AA2FF;
          background:var(--bg); min-height:calc(100vh - 64px); padding:40px 32px 64px; font-family:'Inter',sans-serif; }
        .pdfm-header { display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:20px; max-width:1160px; margin:0 auto 28px; }
        .pdfm-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); margin:0 0 6px; font-weight:600; }
        .pdfm-title { font-size:30px; font-weight:700; color:var(--text); margin:0; }
        .pdfm-toolbar { display:flex; gap:10px; align-items:center; }
        .pdfm-search { display:flex; align-items:center; gap:8px; background:var(--card); border:1px solid var(--b); border-radius:8px; padding:9px 14px; color:var(--muted); transition:border-color .15s; }
        .pdfm-search:focus-within { border-color:var(--accent); color:var(--accent-hover); }
        .pdfm-search input { border:none; outline:none; font-size:14px; color:var(--text); width:200px; background:transparent; }
        .pdfm-search input::placeholder { color:var(--muted); }
        .pdfm-card { max-width:1160px; margin:0 auto; background:var(--card); border:1px solid var(--b); border-radius:12px; overflow:hidden; position:relative; }
        .pdfm-dropzone.pdfm-dragover::after { content:"Solte o PDF para enviar"; position:absolute; inset:0; background:rgba(124,134,255,0.08); border:2px dashed var(--accent); border-radius:12px; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:13px; color:var(--accent-hover); z-index:5; pointer-events:none; }
        .pdfm-file-cell { display:flex; align-items:center; gap:10px; }
        .pdfm-file-name { font-weight:500; color:var(--text); display:block; }
        .pdfm-mono { font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:var(--muted); }
        .pdfm-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 11px; border-radius:999px; font-size:12px; font-weight:600; }
        .pdfm-actions { display:flex; gap:6px; }
        .pdfm-icon-btn { display:flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:7px; border:1px solid var(--b); background:var(--card); color:var(--muted); cursor:pointer; transition:all .15s; }
        .pdfm-icon-btn:hover { background:var(--hover); color:var(--text); border-color:var(--accent); }
        .pdfm-icon-btn-danger:hover { background:rgba(224,107,101,0.14); color:#F29C98; border-color:#7A3330; }
      `}</style>

      <div className="pdfm-wrap">
        <div className="pdfm-header">
          <div>
            <p className="pdfm-eyebrow">Histórico</p>
            <h2 className="pdfm-title">Análises de PDFs</h2>
          </div>
          <div className="pdfm-toolbar">
            <label className="pdfm-search">
              <SearchIcon />
              <input type="text" placeholder="Buscar no extrato..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
            </label>
            <input type="file" accept="application/pdf" ref={fileInputRef} style={{ display: "none" }} onChange={handleArquivoSelecionado} />
          </div>
        </div>

        <div
          className={`pdfm-card pdfm-dropzone ${dragOver ? "pdfm-dragover" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <DataTable
            columns={colunas}
            data={analisesFiltradas}
            progressPending={loading}
            customStyles={customStyles}
            pagination
            highlightOnHover
            noDataComponent={<div style={{ padding: "48px 0", color: "#7C8299", fontSize: "14px" }}>Nenhuma análise encontrada</div>}
          />
        </div>
      </div>
    </>
  );
}
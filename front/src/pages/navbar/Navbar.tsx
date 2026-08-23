import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Cadastro', href: '/cadastro' },
    { label: 'Conversor', href: '/extrair_texto' },
    { label: 'Login', href: '/login' },
    { label: 'Meus PDFS', href: '/meus_pdfs' },
  ];

  const dadosString = sessionStorage.getItem("usuario");
  const usuario = dadosString ? JSON.parse(dadosString) : null;

  if (usuario) {
    console.log("E-mail:", usuario.email);
    console.log("Nome:", usuario.nome);
    console.log("Cidade:", usuario.cidade);
  }

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-[#f0f4f8] border-b border-indigo-100 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-semibold text-slate-700 tracking-tight shrink-0"
          >
            Like<span className="text-[#38bdf8]">PDF</span>
          </a>

          {/* Links e Botão */}
          <div className="flex items-center gap-8 shrink-0">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            
            {/* Área do Usuário com Dropdown */}
            {usuario ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 bg-indigo-50/60 hover:bg-indigo-100/60 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                >
                  <div className="w-7 h-7 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-xs font-bold">
                    {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{usuario.nome}</span>
                  <svg className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Logado como</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{usuario.email}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-base font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
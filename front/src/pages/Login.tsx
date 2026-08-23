import { useState } from 'react';
import Swal from 'sweetalert2';
import { Navbar } from '../pages/navbar/Navbar';
import { fazerLogin } from '../services/api';


export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setCarregando(true);

    try {
      if (!email || !senha) {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Preencha o e-mail e a senha para continuar.',
          background: '#0f1424',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
        return;
      }

      const resposta = await fazerLogin( email, senha );
      console.log('Logado com sucesso:', resposta);
      sessionStorage.setItem("usuario", JSON.stringify(resposta.data));
      window.location.href = "/";


    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      const mensagemErro = 
        error.response?.data?.mensagem || 
        error.response?.data?.message || 
        'Aconteceu um erro, tente mais tarde.';

      Swal.fire({
        icon: 'error',
        title: 'Erro no Login',
        text: typeof mensagemErro === 'string' ? mensagemErro : 'Não foi possível entrar.',
        background: '#0f1424',
        color: '#fff',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />

      <div className="w-full">
        {/* Jumbotron / Hero */}
        <div className="w-full bg-[#0f1424] border-b border-white/10 py-8 px-4 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Acessar Conta
          </h1>
          <p className="mt-2 text-slate-400 max-w-md mx-auto text-sm">
            Entre com suas credenciais para acessar o painel.
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="w-full max-w-md mx-auto py-12 px-4">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-1.5">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                name="senha"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleLogin(); // Chama a sua função de submit quando apertar Enter
      }
    }}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button 
              onClick={handleLogin} 
              disabled={carregando} 
              className="btn btn-primary flex items-center justify-center gap-2 w-44 mx-auto mt-2"
            >
              {carregando && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
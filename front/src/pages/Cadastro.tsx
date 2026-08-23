import { useState } from 'react';
import { enviarCadastroUsuarios } from '../services/api';
import { Navbar } from '../pages/navbar/Navbar'
import Swal from 'sweetalert2';

export function Cadastro() {


  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const[request,setRequest] = useState('');


  async function handleSubmit() {
    setEnviando(true);
    setErro('');

    try {
      if (!nome || !email || !cidade || !telefone || !senha) {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Preencha todos os campos antes de continuar.',
          background: '#0f1424',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
        return
      }
      const telefoneLimpo = telefone.replace(/\D/g, '');
      
      const resultado = await enviarCadastroUsuarios({ nome, email, cidade, telefone:telefoneLimpo, senha });
      
      console.log('Cadastro enviado com sucesso:', resultado);
      setRequest("Os dados foram cadastrados !");
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Cadastro enviado!',
      //   text: 'Seus dados foram enviados com sucesso.',
      //   background: '#0f1424',
      //   color: '#fff',
      //   confirmButtonColor: '#6366f1'
      // });

    }catch (error: any) {
  console.group("--- DETALHES DO ERRO AXIOS ---");
  console.log("Erro completo:", error);
  console.log("error.response:", error.response);
  console.log("error.response?.data:", error.response?.data);
  console.groupEnd();

  // Tenta pegar a mensagem de todas as formas possíveis
  const mensagemErro = 
   error.response?.data.mensagem;

  Swal.fire({
    icon: 'error',
    title: 'Erro',
    text: typeof mensagemErro === 'string' ? mensagemErro : JSON.stringify(mensagemErro),
    background: '#0f1424',
    color: '#fff',
    confirmButtonColor: '#6366f1'
  });
} finally {
      setEnviando(false);
    }
  }

  function handleChangeNome(ev) {
    setNome(ev.target.value);
  }
  function handleChangeEmail(ev) {
    setEmail(ev.target.value);
  }
  function handleChangeCidade(ev) {
    setCidade(ev.target.value);
  }

  function handleChangeTelefone(ev) {
    let valor = ev.target.value.replace(/\D/g, ''); // remove tudo que não é número
    valor = valor.slice(0, 11); // limita a 11 dígitos (DDD + 9 número)

    if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }

    setTelefone(valor);
  }


  function handleChangeSenha(ev) {
    setSenha(ev.target.value);
  }


  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />

      <div className="w-full">
        {/* Jumbotron / Hero */}
        <div className="w-full bg-[#0f1424] border-b border-white/10 py-8 px-4 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Cadastro
          </h1>
          <p className="mt-2 text-slate-400 max-w-md mx-auto text-sm">
            Preencha seus dados abaixo para participar do processo seletivo.
          </p>
        </div>

        {/* Formulário */}
        <div className="w-full max-w-md mx-auto py-12 px-4">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-1.5">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                name="nome"
                placeholder="Digite seu nome"
                onChange={handleChangeNome}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Digite seu email"
                onChange={handleChangeEmail}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-slate-300 mb-1.5">
                Cidade
              </label>
              <input
                id="cidade"
                type="text"
                name="cidade"
                placeholder="Digite sua cidade"
                onChange={handleChangeCidade}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-1.5">
                Celular
              </label>
              <input
                id="telefone"
                type="text"
                name="telefone"
                placeholder="(11) 91234-5678"
                value={telefone}
                onChange={handleChangeTelefone}
                maxLength={15}
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
                onChange={handleChangeSenha}
                className="form-control bg-[#0f1424] border border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              {request && (<span className="text-emerald-400 text-center block w-full mt-2 text-base font-semibold">{request}</span>)}
            </div>

            <button onClick={handleSubmit} disabled={enviando} className="btn btn-primary flex items-center justify-center gap-2 w-44 mx-auto mt-2">
              {enviando && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {enviando ? 'Enviando' : 'Enviar Cadastro'}


            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
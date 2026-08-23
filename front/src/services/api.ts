import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/',
  headers: {
    'x-api-key': 'minha-chave-super-secreta-123',
    'Content-Type': 'application/json'
  }
});

interface CadastroUsuario {
  nome: string;
  sexo: string;
  email: string;  // Exemplo de campo que podia estar faltando
  senha: string;  // Exemplo de campo que podia estar faltando
} 

  export const enviarCadastroUsuarios = async (dados: CadastroUsuario) => {
    const response = await api.post("/cadastro", dados);
    return response.data;
  };

 export const fazerLogin = async (email: string, senha: string) => {
  const response = await api.post('/login', { email, senha });
  return response.data;
};

export const salvarTexto = async (texto : string, id : string) =>{
  const response = await api.post("/salvar_texto",{texto,id});
  return response.data;
}

export const meusPDFS = async (id: number) => {
  const response = await api.get(`/meus_pdfs/${id}`);
  return response.data;
};
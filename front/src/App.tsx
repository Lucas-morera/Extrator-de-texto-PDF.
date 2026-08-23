import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Cadastro } from './pages/Cadastro';
import {ExtratorPDF} from './pages/ExtratorPDF';
import { Login } from './pages/Login';
import { MeusPDFS } from './pages/MeusPDFS';


export function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<Home />} />

        {/* Rota /Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/extrair_texto" element={<ExtratorPDF />} />
        <Route path="/login" element={ <Login /> } />
        <Route path="/meus_pdfs" element={ <MeusPDFS /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
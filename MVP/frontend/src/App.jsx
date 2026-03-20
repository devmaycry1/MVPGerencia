import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação das telas já criadas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Componentes provisórios (vamos substituí-los pelos reais em breve)
const Home = () => <div style={{ padding: '2rem', fontFamily: 'Inter' }}><h1>Tela Home: Lista de Anúncios (Em breve)</h1></div>;
const CriarAnuncio = () => <div style={{ padding: '2rem', fontFamily: 'Inter' }}><h1>Tela: Criar Novo Anúncio (Em breve)</h1></div>;
const DetalhesAnuncio = () => <div style={{ padding: '2rem', fontFamily: 'Inter' }}><h1>Tela: Detalhes do Anúncio (Em breve)</h1></div>;

/**
 * Componente que protege rotas.
 * Se o usuário não estiver no localStorage, manda pro /login.
 */
const RotaPrivada = ({ children }) => {
  const usuarioLogado = localStorage.getItem('usuarioMercadoDCX');

  if (!usuarioLogado) {
    // Retorna para o login se não houver sessão
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a tela solicitada
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Rotas Públicas === */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* === Rotas Privadas === */}
        <Route
          path="/"
          element={
            <RotaPrivada>
              <Home />
            </RotaPrivada>
          }
        />

        <Route
          path="/criar-anuncio"
          element={
            <RotaPrivada>
              <CriarAnuncio />
            </RotaPrivada>
          }
        />

        {/* Rota com parâmetro dinâmico (:id) para exibir um produto específico */}
        <Route
          path="/anuncio/:id"
          element={
            <RotaPrivada>
              <DetalhesAnuncio />
            </RotaPrivada>
          }
        />

        {/* === Fallback (Rota não encontrada) === */}
        {/* Qualquer URL inválida joga o usuário para a Home (que por sua vez fará a checagem de login) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
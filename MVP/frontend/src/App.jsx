import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import CriarAnuncio from './pages/CriarAnuncio';

const DetalhesAnuncio = () => <div style={{ padding: '2rem', fontFamily: 'Inter' }}><h1>Tela: Detalhes do Anúncio (Em breve)</h1></div>;

const RotaPrivada = ({ children }) => {
  const usuarioLogado = localStorage.getItem('usuarioMercadoDCX');

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
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

        <Route
          path="/anuncio/:id"
          element={
            <RotaPrivada>
              <DetalhesAnuncio />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
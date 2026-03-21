import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import CriarAnuncio from './pages/CriarAnuncio';
import VisualizarAnuncio from './pages/VisualizarAnuncio';
import PerfilUsuario from './pages/PerfilUsuario';

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
              <VisualizarAnuncio />
            </RotaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/perfil" element={<RotaPrivada><PerfilUsuario /></RotaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
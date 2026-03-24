import React, { useState } from 'react';
import { Store, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { obterMensagemErro } from '../utils/validacao';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errosForm, setErrosForm] = useState({});
    const [erroGlobal, setErroGlobal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBlur = (e) => {
        const { name, validity } = e.target;
        const mensagemErro = obterMensagemErro(name, validity);
        setErrosForm(prev => ({ ...prev, [name]: mensagemErro }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErroGlobal('');

        if (!e.target.checkValidity()) {
            setErroGlobal('Por favor, preencha os campos corretamente.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/usuarios?email=${email}&senha=${senha}`);
            const usersEncontrados = await response.json();

            if (usersEncontrados.length > 0) {
                const userLogado = usersEncontrados[0];

                localStorage.setItem('usuarioMercadoDCX', JSON.stringify({
                    id: userLogado.id,
                    nome: userLogado.nome,
                    email: userLogado.email,
                    curso: userLogado.curso
                }));

                navigate('/');
            } else {
                setErroGlobal('Email ou senha incorretos. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro no login:", error);
            setErroGlobal('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    const estiloErro = { color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' };

    return (
        <div className="login-wrapper">

            <main className="main-content">
                <div className="login-card">

                    <div className="card-left">
                        <Store className="icon-large" size={64} />
                        <h1 className="welcome-title">Bem-vindo ao<br />Mercado DCX</h1>
                        <p className="welcome-subtitle">
                            O marketplace exclusivo para a comunidade acadêmica do Campus IV da UFPB.
                        </p>
                    </div>

                    <div className="card-right">

                        <div className="brand-header">
                            <div className="brand-icon">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="brand-name">Mercado DCX</span>
                        </div>

                        <div className="form-header">
                            <h2 className="form-title">Fazer Login</h2>
                            <p className="form-subtitle">Acesse sua conta para começar a anunciar.</p>
                        </div>

                        {erroGlobal && (
                            <div className="error-message">
                                {erroGlobal}
                            </div>
                        )}

                        <form className="login-form" onSubmit={handleLogin} noValidate>

                            <div className="input-group">
                                <label>Email Institucional</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErroGlobal('');
                                        setErrosForm(prev => ({ ...prev, email: '' }));
                                    }}
                                    onBlur={handleBlur}
                                    className={errosForm.email ? 'input-error' : ''}
                                    placeholder="seu.email@dcx.ufpb.br"
                                    required
                                />
                                {errosForm.email && <span style={estiloErro}>{errosForm.email}</span>}
                            </div>

                            <div className="input-group">
                                <label>Senha</label>
                                <input
                                    type="password"
                                    name="senha"
                                    value={senha}
                                    onChange={(e) => {
                                        setSenha(e.target.value);
                                        setErroGlobal('');
                                        setErrosForm(prev => ({ ...prev, senha: '' }));
                                    }}
                                    onBlur={handleBlur}
                                    className={errosForm.senha ? 'input-error' : ''}
                                    placeholder="Sua senha"
                                    required
                                />
                                {errosForm.senha && <span style={estiloErro}>{errosForm.senha}</span>}
                            </div>

                            <div className="form-actions">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    Lembrar senha
                                </label>
                                <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>
                                    Esqueci minha senha
                                </a>
                            </div>

                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <div className="register-link-container">
                            <span className="register-text">Não possui uma conta? </span>
                            <Link to="/cadastro" className="register-link">Clique aqui</Link>
                        </div>

                    </div>
                </div>
            </main>

            <footer className="footer">
                <div className="footer-brand">
                    <div className="footer-icon">
                        <ShoppingBag size={16} />
                    </div>
                    <span>Mercado DCX</span>
                </div>

                <div className="footer-links">
                    <a href="#" onClick={(e) => e.preventDefault()}>Termos de Uso</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Privacidade</a>
                    <a href="#" onClick={(e) => e.preventDefault()}>Suporte</a>
                </div>

                <div className="footer-copyright">
                    © 2026 Mercado DCX - Projeto Acadêmico
                </div>
            </footer>
        </div>
    );
};

export default Login;
import { useState } from 'react';
import { Store, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { obterMensagemErro } from '../utils/validacao';
import './Cadastro.css';

const Cadastro = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        curso: '',
        matricula: '',
        senha: '',
        confirmarSenha: ''
    });

    const [errosForm, setErrosForm] = useState({});
    const [erroGlobal, setErroGlobal] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errosForm[name]) {
            setErrosForm(prev => ({ ...prev, [name]: '' }));
        }
        if (erroGlobal) setErroGlobal('');
    };

    const handleBlur = (e) => {
        const { name, validity, value } = e.target;
        let mensagemErro = obterMensagemErro(name, validity);

        if (name === 'email' && value && !value.endsWith('@dcx.ufpb.br')) {
            mensagemErro = 'Use seu email institucional (@dcx.ufpb.br).';
            e.target.setCustomValidity(mensagemErro);
        } else if (name === 'email') {
            e.target.setCustomValidity('');
        }

        if (name === 'confirmarSenha' && formData.senha !== formData.confirmarSenha) {
            mensagemErro = 'As senhas não coincidem.';
            e.target.setCustomValidity(mensagemErro);
        } else if (name === 'confirmarSenha') {
            e.target.setCustomValidity('');
        }

        setErrosForm(prev => ({ ...prev, [name]: mensagemErro }));
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        setErroGlobal('');

        if (!formData.email.endsWith('@dcx.ufpb.br')) {
            setErroGlobal('Apenas emails @dcx.ufpb.br são permitidos.');
            return;
        }

        if (!e.target.checkValidity()) {
            setErroGlobal('Por favor, preencha todos os campos corretamente antes de continuar.');
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            setErrosForm(prev => ({ ...prev, confirmarSenha: 'As senhas não coincidem.' }));
            return;
        }

        setLoading(true);

        try {

            const responseCheck = await fetch(`http://localhost:3001/usuarios?email=${formData.email}`);
            const usersEncontrados = await responseCheck.json();

            if (usersEncontrados.length > 0) {
                setErroGlobal('Este email já está cadastrado. Faça login ou use outro email.');
                setLoading(false);
                return;
            }

            const { _confirmarSenha, ...dadosParaSalvar } = formData;

            const responseCreate = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaSalvar),
            });

            if (responseCreate.ok) {
                alert('Conta criada com sucesso! Faça login para continuar.');
                navigate('/login');
            } else {
                setErroGlobal('Erro ao criar a conta. Tente novamente mais tarde.');
            }
        } catch (error) {
            console.error(error);
            setErroGlobal('Erro de conexão. Verifique se o backend (json-server) está rodando.');
        } finally {
            setLoading(false);
        }
    };

    const estiloErro = { color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' };

    return (
        <div className="cadastro-wrapper">
            <header className="navbar">
                <div className="navbar-brand">
                    <div className="navbar-icon">
                        <Store size={20} />
                    </div>
                    <span className="navbar-title">Mercado DCX</span>
                </div>
            </header>

            <main className="cadastro-main">
                <div className="page-header">
                    <h1 className="page-title">Crie sua conta</h1>
                    <p className="page-subtitle">Crie sua conta e comece a criar seus anúncios!</p>
                </div>

                <div className="cadastro-card">
                    <h2 className="card-title">Preencha com seus dados</h2>

                    {erroGlobal && (
                        <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
                            {erroGlobal}
                        </div>
                    )}

                    <form className="cadastro-form" onSubmit={handleCadastro} noValidate>

                        <div className="input-group">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Ex: João Pedro"
                                className={errosForm.nome ? 'input-error' : ''}
                                required
                            />
                            {errosForm.nome && <span style={estiloErro}>{errosForm.nome}</span>}
                        </div>

                        <div className="input-group">
                            <label>Email Institucional</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="seu.email@dcx.ufpb.br"
                                className={errosForm.email ? 'input-error' : ''}
                                required
                            />
                            {errosForm.email && <span style={estiloErro}>{errosForm.email}</span>}
                        </div>

                        <div className="form-row">
                            <div className="input-group half-width">
                                <label>Curso</label>
                                <select name="curso" value={formData.curso} onChange={handleChange} className={errosForm.curso ? 'input-error' : ''} onBlur={handleBlur} required>
                                    <option value="" disabled>Selecione</option>
                                    <option value="Sistemas de Informação">Sistemas de Informação</option>
                                    <option value="Ciência da Computação">Ecologia</option>
                                    <option value="Licenciatura em Computação">Licenciatura em Computação</option>
                                    <option value="Design">Design</option>
                                </select>
                                {errosForm.curso && <span style={estiloErro}>{errosForm.curso}</span>}
                            </div>

                            <div className="input-group half-width">
                                <label>Matrícula</label>
                                <input
                                    type="text"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Ex: 2022043043"
                                    pattern="[0-9]+"
                                    className={errosForm.matricula ? 'input-error' : ''}
                                    required
                                />
                                {errosForm.matricula && <span style={estiloErro}>{errosForm.matricula}</span>}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••••••"
                                minLength="6"
                                className={errosForm.senha ? 'input-error' : ''}
                                required
                            />
                            {errosForm.senha && <span style={estiloErro}>{errosForm.senha}</span>}
                        </div>

                        <div className="input-group">
                            <label>Confirme a senha</label>
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="••••••••••••"
                                minLength="6"
                                className={errosForm.confirmarSenha ? 'input-error' : ''}
                                required
                            />
                            {errosForm.confirmarSenha && <span style={estiloErro}>{errosForm.confirmarSenha}</span>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="login-link-container">
                        <span className="login-text">Já possui uma conta? </span>
                        <Link to="/login" className="login-link">Faça Login</Link>
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
                    <a href="#">Termos de Uso</a>
                    <a href="#">Privacidade</a>
                    <a href="#">Suporte</a>
                </div>
                <div className="footer-copyright">
                    © 2026 Mercado DCX - Projeto Acadêmico
                </div>
            </footer>
        </div>
    );
};

export default Cadastro;
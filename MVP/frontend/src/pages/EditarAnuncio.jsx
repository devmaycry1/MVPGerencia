import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, MapPin, XCircle, Send, CheckCircle, Lock } from 'lucide-react';
import './CriarAnuncio.css';

const EditarAnuncio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/anuncios/${id}`)
            .then(res => res.json())
            .then(data => setFormData(data))
            .catch(err => console.error("Erro ao carregar anúncio:", err));
    }, [id]);

    // Trava de segurança: define se o formulário deve ser bloqueado
    const isVendido = formData?.status === 'Vendido';

    const handleChange = (e) => {
        if (isVendido) return; // Segurança extra no nível da função
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMarcarVendido = async () => {
        const confirmar = window.confirm(
            "Deseja marcar como VENDIDO? \n\nEsta ação removerá o item da Home e bloqueará edições futuras."
        );

        if (!confirmar) return;

        try {
            await fetch(`http://localhost:3001/anuncios/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Vendido' })
            });
            alert("Venda confirmada com sucesso!");
            navigate('/perfil');
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isVendido) return;
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/anuncios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Anúncio atualizado com sucesso!');
                navigate('/perfil');
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return <div className="loading">Carregando dados do anúncio...</div>;

    return (
        <div className="criar-anuncio-wrapper">
            <header className="home-header">
                <div className="header-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <Store size={24} color="#003b82" />
                    <span className="brand-name">Mercado DCX</span>
                </div>
            </header>

            <main className="criar-main">
                <div className="page-header-anuncio">
                    <h1>{isVendido ? 'Visualizar Item Vendido' : 'Editar Anúncio'}</h1>
                    <p>{isVendido ? 'Este anúncio não pode mais ser editado.' : 'Mantenha as informações do seu item atualizadas.'}</p>
                </div>

                {/* Alerta Visual de Bloqueio */}
                {isVendido && (
                    <div className="alert-lock-anuncio">
                        <Lock size={18} />
                        <span>Este anúncio está bloqueado para edições pois já foi marcado como vendido.</span>
                    </div>
                )}

                <form className="form-anuncio-container" onSubmit={handleSubmit}>
                    <div className="form-column">
                        <div className="card-form section-info">
                            <div className="input-group">
                                <label>Título do Anúncio</label>
                                <input
                                    type="text" name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    disabled={isVendido}
                                />
                            </div>
                            <div className="form-row">
                                <div className="input-group half-width">
                                    <label>Categoria</label>
                                    <select name="categoria" value={formData.categoria} onChange={handleChange} disabled={isVendido}>
                                        <option value="Eletrônicos">Eletrônicos</option>
                                        <option value="Alimentação">Alimentação</option>
                                        <option value="Livros">Livros</option>
                                        <option value="Serviços">Serviços</option>
                                    </select>
                                </div>
                                <div className="input-group half-width">
                                    <label>Preço (R$)</label>
                                    <input type="number" name="preco" value={formData.preco} onChange={handleChange} disabled={isVendido} />
                                </div>
                            </div>
                        </div>

                        <div className="card-form">
                            <label>Descrição</label>
                            <textarea name="descricao" value={formData.descricao} onChange={handleChange} disabled={isVendido}></textarea>
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="card-form section-loc">
                            <div className="input-group">
                                <label>Local de Entrega</label>
                                <div className="select-with-icon">
                                    <MapPin size={18} className="icon-input" />
                                    <select name="localizacao" value={formData.localizacao} onChange={handleChange} disabled={isVendido}>
                                        <option value="Campus IV - Rio Tinto">Campus IV - Rio Tinto</option>
                                        <option value="Campus IV - Mamanguape">Campus IV - Mamanguape</option>
                                        <option value="Rio Tinto">Rio Tinto</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions-anuncio" style={{ flexDirection: 'column' }}>
                                {!isVendido ? (
                                    <>
                                        <button type="submit" className="btn-publish" disabled={loading}>
                                            <Send size={18} /> Salvar Alterações
                                        </button>
                                        <button type="button" className="btn-sold-action" onClick={handleMarcarVendido}>
                                            <CheckCircle size={18} /> Marcar como Vendido
                                        </button>
                                    </>
                                ) : (
                                    <div className="sold-info-badge">
                                        Status: Item Finalizado
                                    </div>
                                )}

                                <button type="button" className="btn-cancel" onClick={() => navigate('/perfil')}>
                                    <XCircle size={18} /> {isVendido ? 'Voltar ao Perfil' : 'Cancelar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditarAnuncio;
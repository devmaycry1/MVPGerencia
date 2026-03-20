import React, { useState } from 'react';
import { Store, ShoppingBag, Upload, Package, Wrench, MapPin, XCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CriarAnuncio.css';

const CriarAnuncio = () => {
    const navigate = useNavigate();
    
    // Recupera o usuário logado do localStorage para vincular ao anúncio
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioMercadoDCX'));

    const [formData, setFormData] = useState({
        titulo: '',
        categoria: '',
        preco: '',
        tipo: 'Produto',
        descricao: '',
        localizacao: 'Campus IV - Rio Tinto',
        telefone: '',
        imagens: []
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Lógica para alternar entre Produto e Serviço
    const handleTipoChange = (novoTipo) => {
        if (novoTipo === 'Serviço') {
            setFormData({
                ...formData,
                tipo: 'Serviço',
                categoria: 'Serviços', // Seleção automática
                localizacao: 'Rio Tinto', // Localização padrão para serviço
                titulo: '' // Limpa para novo placeholder
            });
        } else {
            setFormData({
                ...formData,
                tipo: 'Produto',
                categoria: '',
                localizacao: 'Campus IV - Rio Tinto', // Localização padrão para produto
                titulo: ''
            });
        }
    };

    const handleImageAdd = () => {
        const url = prompt("Cole aqui a URL de uma imagem (Ex: Unsplash):");
        if (url && formData.imagens.length < 5) {
            setFormData({ ...formData, imagens: [...formData.imagens, url] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const novoAnuncio = {
            ...formData,
            preco: parseFloat(formData.preco),
            vendedor: usuarioLogado.nome,
            vendedorId: usuarioLogado.id,
            dataCriacao: new Date().toISOString(),
            imagem: formData.imagens[0] || 'https://via.placeholder.com/300?text=Sem+Foto'
        };

        try {
            const response = await fetch('http://localhost:3001/anuncios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoAnuncio)
            });

            if (response.ok) {
                alert('Anúncio publicado com sucesso!');
                navigate('/');
            }
        } catch (error) {
            console.error("Erro ao publicar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="criar-anuncio-wrapper">
            <header className="home-header">
                <div className="header-left">
                    <Store size={24} color="#003b82" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                    <span className="brand-name">Mercado DCX</span>
                </div>
            </header>

            <main className="criar-main">
                <div className="page-header-anuncio">
                    <h1>Anunciar no Mercado DCX</h1>
                    <p>Preencha os dados abaixo para publicar seu anúncio</p>
                </div>

                <form className="form-anuncio-container" onSubmit={handleSubmit}>
                    <div className="form-column">
                        <div className="card-form section-info">
                            <div className="input-group">
                                <label>
                                    {formData.tipo === 'Serviço' ? 'Qual serviço você oferece?' : 'O que vc quer vender?'}
                                </label>
                                <input 
                                    type="text" 
                                    name="titulo" 
                                    value={formData.titulo}
                                    placeholder={formData.tipo === 'Serviço' ? 'Ex: Formatação de PC' : 'Ex: Livro de Cálculo'} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="form-row">
                                <div className="input-group half-width">
                                    <label>Categoria</label>
                                    <select 
                                        name="categoria" 
                                        value={formData.categoria} 
                                        onChange={handleChange} 
                                        required
                                    >
                                        <option value="">Selecione a Categoria</option>
                                        <option value="Eletrônicos">Eletrônicos</option>
                                        <option value="Alimentação">Alimentação</option>
                                        <option value="Livros">Livros</option>
                                        <option value="Serviços">Serviços</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                                <div className="input-group half-width">
                                    <label>Preço (R$)</label>
                                    <input type="number" name="preco" placeholder="R$ 0,00" step="0.01" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Tipo</label>
                                <div className="tipo-buttons">
                                    <button 
                                        type="button" 
                                        className={formData.tipo === 'Produto' ? 'active' : ''} 
                                        onClick={() => handleTipoChange('Produto')}
                                    >
                                        <Package size={18} /> Produto
                                    </button>
                                    <button 
                                        type="button" 
                                        className={formData.tipo === 'Serviço' ? 'active' : ''}
                                        onClick={() => handleTipoChange('Serviço')}
                                    >
                                        <Wrench size={18} /> Serviço
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-form section-desc">
                            <div className="input-group">
                                <label>
                                    {formData.tipo === 'Serviço' ? 'Forneça detalhes do serviço' : 'Forneça detalhes do produto'}
                                </label>
                                <textarea 
                                    name="descricao" 
                                    placeholder={
                                        formData.tipo === 'Serviço' 
                                        ? "Descreva as etapas, tempo estimado e o que está incluso..." 
                                        : "Descreva detalhes do item, estado de conservação e acessórios..."
                                    }
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="form-column">
                        <div className="card-form section-media">
                            <label>Fotos do Anúncio (Até 5)</label>
                            <div className="upload-area" onClick={handleImageAdd}>
                                <Upload size={32} color="#003b82" />
                                <p>Arraste as fotos aqui ou clique para selecionar</p>
                                <span>PNG, JPG ou WEBP (Máx 5MB)</span>
                            </div>
                            <div className="image-preview-list">
                                {formData.imagens.map((img, index) => (
                                    <img key={index} src={img} alt="Preview" className="img-mini" />
                                ))}
                            </div>
                        </div>

                        <div className="card-form section-loc">
                            <div className="input-group">
                                <label>{formData.tipo === 'Serviço' ? 'Local de Atendimento' : 'Localização da Entrega'}</label>
                                <div className="select-with-icon">
                                    <MapPin size={18} className="icon-input" />
                                    <select name="localizacao" value={formData.localizacao} onChange={handleChange}>
                                        {formData.tipo === 'Serviço' ? (
                                            <>
                                                <option value="Araçagi">Araçagi</option>
                                                <option value="Guarabira">Guarabira</option>
                                                <option value="Itapororoca">Itapororoca</option>
                                                <option value="Mamanguape">Mamanguape</option>
                                                <option value="Rio Tinto">Rio Tinto</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Campus IV - Rio Tinto">Campus IV - Rio Tinto</option>
                                                <option value="Campus IV - Mamanguape">Campus IV - Mamanguape</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Telefone para Contato</label>
                                <input type="text" name="telefone" placeholder="DDD + Número de Telefone" onChange={handleChange} required />
                            </div>

                            <div className="form-actions-anuncio">
                                <button type="submit" className="btn-publish" disabled={loading}>
                                    <Send size={18} /> {loading ? 'Publicando...' : 'Publicar Anúncio'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                                    <XCircle size={18} /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CriarAnuncio;
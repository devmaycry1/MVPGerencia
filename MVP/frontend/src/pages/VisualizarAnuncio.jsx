import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, Copy, MapPin, ChevronRight, User, Calendar, Star, FileText } from 'lucide-react';
import './VisualizarAnuncio.css';

const VisualizarAnuncio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anuncio, setAnuncio] = useState(null);
    const [imagemPrincipal, setImagemPrincipal] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/anuncios/${id}`)
            .then(res => res.json())
            .then(data => {
                setAnuncio(data);
                // Define a primeira imagem da lista como principal
                setImagemPrincipal(data.imagens && data.imagens.length > 0 ? data.imagens[0] : data.imagem);
            })
            .catch(err => console.error("Erro ao carregar anúncio:", err));
    }, [id]);

    const copiarTelefone = () => {
        navigator.clipboard.writeText(anuncio.telefone);
        alert("Telefone copiado para a área de transferência!");
    };

    if (!anuncio) return <div className="loading">Carregando anúncio...</div>;

    return (
        <div className="view-wrapper">
            <header className="home-header">
                <div className="header-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <Store size={24} color="#003b82" />
                    <span className="brand-name">Mercado DCX</span>
                </div>
            </header>

            <main className="view-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <span onClick={() => navigate('/')}>Home</span>
                    <ChevronRight size={14} />
                    <span>{anuncio.categoria}</span>
                    <ChevronRight size={14} />
                    <span className="active">{anuncio.titulo}</span>
                </nav>

                <div className="product-grid">
                    {/* Coluna da Esquerda: Galeria */}
                    <section className="gallery-section">
                        <div className="main-image-container">
                            <img src={imagemPrincipal} alt={anuncio.titulo} />
                        </div>
                        <div className="thumbnails-grid">
                            {/* Mostra as 5 imagens cadastradas se existirem */}
                            {anuncio.imagens && anuncio.imagens.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumb-card ${imagemPrincipal === img ? 'active' : ''}`}
                                    onClick={() => setImagemPrincipal(img)}
                                >
                                    <img src={img} alt={`Miniatura ${idx}`} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Coluna da Direita: Infos e Contato */}
                    <section className="info-section">
                        <span className="badge-usado">{anuncio.tipo}</span>
                        <h1 className="product-title">{anuncio.titulo}</h1>
                        <h2 className="product-price">R$ {anuncio.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>

                        <div className="card-detail description-card">
                            <h3><FileText size={18} /> Descrição</h3>
                            <p>{anuncio.descricao}</p>
                        </div>

                        <div className="card-detail seller-card">
                            <div className="seller-header">
                                <div className="seller-avatar">
                                    <User size={24} color="#fff" />
                                </div>
                                <div className="seller-name-info">
                                    <h4>{anuncio.vendedor}</h4>
                                    <span>Anunciante no Mercado DCX</span>
                                </div>
                            </div>

                            <div className="seller-stats">
                                <div className="stat">
                                    <Star size={16} color="#facc15" fill="#facc15" />
                                    <strong>4.5</strong>
                                    <span>REPUTAÇÃO</span>
                                </div>
                                <div className="stat">
                                    <Calendar size={16} color="#64748b" />
                                    <strong>2026</strong>
                                    <span>MEMBRO DESDE</span>
                                </div>
                            </div>

                            <button className="btn-copy-phone" onClick={copiarTelefone}>
                                <Copy size={18} /> Copiar Telefone
                            </button>
                        </div>

                        <div className="delivery-info">
                            <MapPin size={20} color="#003b82" />
                            <div>
                                <span>{anuncio.tipo === 'Serviço' ? 'LOCAL DE ATENDIMENTO' : 'ENTREGA'}</span>
                                <p>{anuncio.localizacao}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default VisualizarAnuncio;
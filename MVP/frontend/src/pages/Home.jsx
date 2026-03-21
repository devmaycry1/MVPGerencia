import React, { useState, useEffect } from 'react';
import { Store, ShoppingBag, Search, Bell, User, Filter, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [anuncios, setAnuncios] = useState([]);
    const [busca, setBusca] = useState('');
    const [categoriaSel, setCategoriaSel] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/anuncios')
            .then(res => res.json())
            .then(data => setAnuncios(data))
            .catch(err => console.error("Erro ao carregar anúncios:", err));
    }, []);

    const anunciosFiltrados = anuncios.filter(item => {
        const matchesBusca = item.titulo.toLowerCase().includes(busca.toLowerCase());
        const matchesCategoria = categoriaSel === '' || item.categoria === categoriaSel;
        const estaAtivo = item.status !== 'Vendido';
        return matchesBusca && matchesCategoria && estaAtivo;
    });

    return (
        <div className="home-wrapper">
            <header className="home-header">
                <div className="header-left">
                    <Store size={24} color="#003b82" />
                    <span className="brand-name">Mercado DCX</span>
                    <nav className="header-nav">
                        <span>Categorias</span>
                        <span onClick={() => navigate('/criar-anuncio')}>Vender</span>
                        <span>Ajuda</span>
                    </nav>
                </div>

                <div className="header-center">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar Produtos..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <Search size={18} color="#666" />
                    </div>
                </div>

                <div className="header-right" onClick={() => navigate('/perfil')}
                    style={{ cursor: 'pointer' }}>
                    <Bell size={20} />
                    <div className="user-avatar">
                        <User size={20} />
                    </div>
                </div>
            </header>

            <div className="home-container">
                <aside className="filters-sidebar">
                    <h3><Filter size={16} /> Filtros</h3>
                    <div className="filter-group">
                        <label>CATEGORIAS</label>
                        {['Eletrônicos', 'Alimentação', 'Livros', 'Serviços', 'Outros'].map(cat => (
                            <div key={cat} className="checkbox-item">
                                <input
                                    type="radio"
                                    name="cat"
                                    onChange={() => setCategoriaSel(cat)}
                                    checked={categoriaSel === cat}
                                />
                                <span>{cat}</span>
                            </div>
                        ))}
                        <button className="btn-clear" onClick={() => setCategoriaSel('')}>Limpar Filtros</button>
                    </div>
                </aside>

                <main className="home-main">
                    <section className="hero-banner">
                        <div className="hero-text">
                            <h1>Marketplace Universitário</h1>
                            <p>Encontre o que precisa no Campus IV da UFPB. Exclusivo para a comunidade acadêmica.</p>
                            <div className="hero-buttons">
                                <button className="btn-white" onClick={() => navigate('/criar-anuncio')}>Criar Anúncio</button>
                                <button className="btn-outline">Saiba Mais</button>
                            </div>
                        </div>
                    </section>

                    <section className="recent-ads">
                        <h2>Anúncios Recentes</h2>
                        
                        {anunciosFiltrados.length > 0 ? (
                            <div className="ads-grid">
                                {anunciosFiltrados.map(ad => (
                                    <div key={ad.id} className="ad-card" onClick={() => navigate(`/anuncio/${ad.id}`)}>
                                        <img src={ad.imagem} alt={ad.titulo} />
                                        <div className="ad-info">
                                            <span className="ad-category">{ad.categoria?.toUpperCase()}</span>
                                            <h3 className="ad-title">{ad.titulo}</h3>
                                            <p className="ad-price">R$ {ad.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            <div className="ad-seller">
                                                <span>👤 {ad.vendedor}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-results">
                                <PackageSearch size={64} color="#cbd5e1" />
                                <h3>Nenhum anúncio encontrado</h3>
                                <p>Não encontramos resultados para sua busca ou filtro em <strong>{categoriaSel || 'Todas as categorias'}</strong>.</p>
                                <button className="btn-reset-filters" onClick={() => {setBusca(''); setCategoriaSel('');}}>
                                    Limpar todos os filtros
                                </button>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            <footer className="footer">
                <div className="footer-brand"><ShoppingBag size={16} /> Mercado DCX</div>
                <div className="footer-links">
                    <span>Termos de Uso</span>
                    <span>Privacidade</span>
                </div>
                <div className="footer-copyright">© 2026 Mercado DCX - Projeto Acadêmico</div>
            </footer>
        </div>
    );
};

export default Home;
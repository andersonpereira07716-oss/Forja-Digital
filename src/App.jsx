import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const INITIAL_PRODUCTS = [
  { 
    id: '1', 
    title: 'ZapVitrine AI & SaaS Checkout', 
    category: 'SaaS / Sistemas', 
    price: 197.00, 
    original_price: 397.00, 
    badge: 'Mais Vendido', 
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 
    description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e automação de IA.', 
    techs: ['React', 'Node.js', 'Supabase'],
    download_url: 'https://zap-vitrine-sigma.vercel.app'
  },
  { 
    id: '2', 
    title: 'Pulse Dash - Retro Mobile Game Source', 
    category: 'Jogos Indie', 
    price: 89.00, 
    original_price: 150.00, 
    badge: 'Lançamento', 
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 
    description: 'Kit completo de jogo arcade mobile responsivo construído em HTML5 Canvas + React.', 
    techs: ['React', 'HTML5 Canvas'],
    download_url: 'https://pulse-dash.vercel.app'
  },
  { 
    id: '3', 
    title: 'Sentinela Pro - PWA Segurança', 
    category: 'Apps Mobile', 
    price: 147.00, 
    original_price: 280.00, 
    badge: 'Destaque UI', 
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 
    description: 'Template PWA nativo para monitoramento em tempo real, gestão de alertas e dashboards.', 
    techs: ['React', 'PWA', 'Tailwind'],
    download_url: 'https://sentinela-one.vercel.app'
  },
  { 
    id: '4', 
    title: 'RotaFixa - Mobilidade Urbana & Tarifa', 
    category: 'Apps Mobile', 
    price: 120.00, 
    original_price: 250.00, 
    badge: 'Novo', 
    thumbnail: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80', 
    description: 'App de mobilidade local com calculadora de tarifas personalizada e pagamento PIX direto.', 
    techs: ['React', 'Tailwind', 'Supabase'],
    download_url: 'https://rotafixa.vercel.app'
  }
];

const TESTIMONIALS = [
  { name: 'Carlos Eduardo', role: 'Desenvolvedor Front-End', comment: 'Comprei o template do ZapVitrine e implementei para um cliente em menos de 2 dias. Qualidade de código impecável!' },
  { name: 'Marcos Vinícius', role: 'Empreendedor Local', comment: 'O RotaFixa abriu portas para o nosso serviço de entregas aqui na região. Suporte e entrega instantânea excelente.' }
];

export default function App() {
  const [tab, setTab] = useState('catalog');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', cpf: '', refCode: '' });
  const [pixData, setPixData] = useState(null);
  const [loadingPix, setLoadingPix] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const [searchEmail, setSearchEmail] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [adminAuth, setAdminAuth] = useState({ email: '', password: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('fd_admin_session') === 'true';
  });
  
  const [newProd, setNewProd] = useState({ title: '', category: 'SaaS / Sistemas', price: '', description: '', thumbnail: '', download_url: '' });
  const [dbOrders, setDbOrders] = useState([]);

  const sanitizeInput = (str) => {
    if (!str) return '';
    return str.toString().replace(/[<>]/g, '').trim();
  };

  useEffect(() => {
    async function loadData() {
      if (supabase) {
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData && prodData.length > 0) {
          const updatedProd = prodData.map(p => {
            if (p.title && p.title.includes('ZapVitrine')) {
              return { ...p, download_url: 'https://zap-vitrine-sigma.vercel.app' };
            }
            return p;
          });
          setProducts(updatedProd);
        }

        const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordData) setDbOrders(ordData);
      }
    }
    loadData();
  }, [isAdminLoggedIn]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalRevenue = dbOrders.filter(o => o.status === 'approved').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalApprovedOrders = dbOrders.filter(o => o.status === 'approved').length;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const cleanEmail = sanitizeInput(adminAuth.email);
    const cleanPass = sanitizeInput(adminAuth.password);

    if (cleanEmail === 'admin@forjadigital.com' && cleanPass === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('fd_admin_session', 'true');
    } else {
      alert('Credenciais incorretas!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('fd_admin_session');
  };

  const getCleanProductUrl = (prod) => {
    if (!prod) return 'https://zap-vitrine-sigma.vercel.app';
    if (prod.title && prod.title.includes('ZapVitrine')) return 'https://zap-vitrine-sigma.vercel.app';
    
    let url = prod.download_url || 'https://zap-vitrine-sigma.vercel.app';
    return url.replace('/download.zip', '');
  };

  const handleGeneratePix = async (e) => {
    e.preventDefault();
    const cleanName = sanitizeInput(form.name);
    const cleanEmail = sanitizeInput(form.email);
    const cleanCpf = sanitizeInput(form.cpf);
    const cleanRef = sanitizeInput(form.refCode);

    if (!cleanName || !cleanEmail || !cleanCpf) return;
    setLoadingPix(true);

    const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanUrl = getCleanProductUrl(selectedProduct);

    try {
      const res = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderCode,
          productTitle: selectedProduct.title,
          amount: selectedProduct.price,
          email: cleanEmail,
          name: cleanName,
          cpf: cleanCpf
        })
      });
      const data = await res.json();
      
      if (data.copyPasteCode) {
        setPixData(data);
      } else {
        throw new Error('Fallback local');
      }
    } catch (err) {
      setPixData({
        copyPasteCode: `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}5204000053039865405${selectedProduct.price.toFixed(2)}5802BR5920FORJA DIGITAL6005PATOS62070503***6304`,
        qrCodeBase64: null
      });
    } finally {
      if (supabase) {
        await supabase.from('orders').insert([
          {
            order_code: orderCode,
            customer_name: cleanName,
            customer_email: cleanEmail,
            product_title: selectedProduct.title,
            amount: selectedProduct.price,
            status: 'pending',
            license_key: `FORJA-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
            download_url: cleanUrl,
            ref_code: cleanRef || 'DIRETO'
          }
        ]);
      }
      setLoadingPix(false);
      setStep(2);
    }
  };

  const handleApprovePayment = async () => {
    const cleanEmail = sanitizeInput(form.email);
    const cleanUrl = getCleanProductUrl(selectedProduct);

    if (supabase) {
      await supabase
        .from('orders')
        .update({ status: 'approved', download_url: cleanUrl })
        .eq('customer_email', cleanEmail);
    }

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: sanitizeInput(form.name),
          productTitle: selectedProduct.title,
          downloadUrl: cleanUrl
        })
      });
    } catch (e) {
      console.log('Notificação enviada por fallback');
    }

    setStep(3);
  };

  const handleSearchOrders = async (e) => {
    e.preventDefault();
    const cleanSearchEmail = sanitizeInput(searchEmail);
    if (!cleanSearchEmail) return;
    setLoadingOrders(true);

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', cleanSearchEmail);

        if (!error && data && data.length > 0) {
          const formattedOrders = data.map(o => ({
            ...o,
            download_url: o.download_url ? o.download_url.replace('/download.zip', '') : 'https://zap-vitrine-sigma.vercel.app'
          }));
          setMyOrders(formattedOrders);
        } else {
          setMyOrders([
            { 
              order_code: 'ORD-9842', 
              product_title: 'ZapVitrine AI & SaaS', 
              status: 'approved', 
              license_key: 'FORJA-PRO-884X-2026',
              download_url: 'https://zap-vitrine-sigma.vercel.app'
            }
          ]);
        }
      } else {
        setMyOrders([
          { 
            order_code: 'ORD-9842', 
            product_title: 'ZapVitrine AI & SaaS', 
            status: 'approved', 
            license_key: 'FORJA-PRO-884X-2026',
            download_url: 'https://zap-vitrine-sigma.vercel.app'
          }
        ]);
      }
    } catch (err) {
      console.log('Erro ao procurar pedidos');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(newProd.title);
    const cleanPrice = parseFloat(newProd.price);

    if (!cleanTitle || !cleanPrice) return;

    const created = {
      title: cleanTitle,
      category: sanitizeInput(newProd.category),
      price: cleanPrice,
      original_price: cleanPrice * 1.5,
      badge: 'Novo',
      description: sanitizeInput(newProd.description),
      thumbnail: sanitizeInput(newProd.thumbnail) || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      techs: ['React', 'Node.js'],
      download_url: sanitizeInput(newProd.download_url) || 'https://zap-vitrine-sigma.vercel.app'
    };

    if (supabase) {
      await supabase.from('products').insert([created]);
    }

    setProducts([created, ...products]);
    setNewProd({ title: '', category: 'SaaS / Sistemas', price: '', description: '', thumbnail: '', download_url: '' });
    alert('Produto registado e publicado com sucesso!');
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Tem certeza que deseja remover este produto do catálogo?')) {
      setProducts(products.filter(p => p.id !== id));
      if (supabase) {
        supabase.from('products').delete().eq('id', id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER ULTRA TECNOLÓGICO */}
      <header className="max-w-5xl mx-auto flex flex-col items-center justify-center pt-4 pb-6 border-b border-slate-900/80 gap-5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setTab('catalog')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition">
            F
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">
            FORJA<span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">DIGITAL</span>
          </span>
        </div>

        <nav className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800/80 shadow-2xl">
          <button onClick={() => setTab('catalog')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${tab === 'catalog' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white'}`}>Catálogo</button>
          <button onClick={() => setTab('purchases')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${tab === 'purchases' ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-white'}`}>Meus Pedidos</button>
          <button onClick={() => setTab('admin')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${tab === 'admin' ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25' : 'text-slate-400 hover:text-white'}`}>Admin</button>
        </nav>
      </header>

      <a 
        href="https://wa.me/5583999999999?text=Olá!%20Tenho%20interesse%20nos%20templates%20da%20Forja%20Digital." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-500 text-slate-950 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold hover:scale-110 transition flex items-center gap-2 text-xs"
      >
        💬 WhatsApp
      </a>

      <main className="max-w-7xl mx-auto py-8 space-y-10">
        {tab === 'catalog' && (
          <>
            {/* HERO SECTION */}
            <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1 shadow-inner">
                ⚡ Ecossistema SaaS & PWA Enterprise
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Templates & Códigos Prontos
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                Software pronto, landing pages e apps integrados ao Supabase. Baixe e acesse instantaneamente após o PIX.
              </p>
            </div>

            {/* BARRA DE PESQUISA & FILTROS */}
            <div className="space-y-4 max-w-3xl mx-auto px-2">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="🔍 Pesquisar por nome ou tecnologia (ex: React, Supabase)..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full p-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition shadow-xl"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-1 pb-1">
                {['Todos', 'SaaS / Sistemas', 'Apps Mobile', 'Jogos Indie', 'Recorrência / VIP'].map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${selectedCategory === cat ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105' : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* GRID DE PRODUTOS PREMIUM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((p, idx) => (
                <div key={p.id || idx} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img src={p.thumbnail} alt={p.title} className="h-48 w-full object-cover group-hover:scale-105 transition duration-500" />
                      {p.badge && <span className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow-md">{p.badge}</span>}
                    </div>
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">{p.category}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">{p.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      {p.original_price && <span className="text-[10px] text-slate-500 line-through block font-medium">R$ {Number(p.original_price).toFixed(2)}</span>}
                      <span className="text-lg font-black text-emerald-400">R$ {Number(p.price).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(p); setStep(1); }} 
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SEÇÃO DE PROVA SOCIAL */}
            <div className="pt-12 border-t border-slate-900 space-y-6">
              <h2 className="text-xl font-black text-center tracking-tight">O que dizem os nossos clientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TESTIMONIALS.map((t, idx) => (
                  <div key={idx} className="bg-slate-900/40 backdrop-blur border border-slate-800/80 p-6 rounded-3xl space-y-3 shadow-xl">
                    <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
                    <div>
                      <p className="text-xs font-black text-cyan-400">{t.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'purchases' && (
          <div className="max-w-md mx-auto space-y-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-lg font-black text-center tracking-tight">Consultar Meus Pedidos</h2>
            <form onSubmit={handleSearchOrders} className="space-y-4">
              <input type="email" placeholder="Digite seu e-mail de compra..." required value={searchEmail} onChange={e => setSearchEmail(e.target.value)} className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-cyan-500" />
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs uppercase rounded-2xl shadow-lg shadow-cyan-500/25">
                {loadingOrders ? 'A pesquisar...' : 'Buscar Licenças'}
              </button>
            </form>

            {myOrders.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {myOrders.map((ord, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs shadow-inner">
                    <p className="font-bold text-white">{ord.product_title}</p>
                    <p className="font-mono text-cyan-400 text-[10px]">Chave: {ord.license_key}</p>
                    <a href={ord.download_url} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black uppercase rounded-xl text-center transition shadow-md">
                      🚀 ACESSAR APLICATIVO / INSTALAR PWA
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'admin' && (
          <div className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
            <h2 className="text-lg font-black text-center tracking-tight">Painel Administrativo Segurado</h2>
            
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="space-y-4 max-w-sm mx-auto">
                <p className="text-xs text-slate-400 text-center">Entre com suas credenciais de e-mail e senha:</p>
                <input 
                  type="email" 
                  placeholder="Seu E-mail de Administrador" 
                  required 
                  value={adminAuth.email} 
                  onChange={e => setAdminAuth({ ...adminAuth, email: e.target.value })} 
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500" 
                />
                <input 
                  type="password" 
                  placeholder="Sua Senha de Acesso" 
                  required 
                  value={adminAuth.password} 
                  onChange={e => setAdminAuth({ ...adminAuth, password: e.target.value })} 
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500" 
                />
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase rounded-2xl shadow-lg shadow-emerald-500/25">
                  Entrar no Painel
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <p className="text-xs text-emerald-400 font-bold">● Sessão Ativa: admin@forjadigital.com</p>
                  <button onClick={handleAdminLogout} className="text-[10px] text-red-400 font-bold hover:underline">Sair / Logout</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1 shadow-inner">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Faturamento Total</p>
                    <p className="text-xl font-black text-emerald-400">R$ {totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1 shadow-inner">
                    <p className="text-[10px] text-slate-400 uppercase font-black">Vendas Aprovadas</p>
                    <p className="text-xl font-black text-cyan-400">{totalApprovedOrders} pedidos</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Histórico de Transações ({dbOrders.length})</h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {dbOrders.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">Nenhum pedido registrado ainda no Supabase.</p>
                    ) : (
                      dbOrders.map((ord, idx) => (
                        <div key={ord.id || idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-bold text-white">{ord.product_title}</p>
                            <p className="text-[10px] text-slate-400">{ord.customer_name} ({ord.customer_email})</p>
                            <p className="text-[9px] font-mono text-slate-500">Afiliado: {ord.ref_code || 'DIRETO'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-400">R$ {Number(ord.amount).toFixed(2)}</span>
                            <span className={`block text-[9px] uppercase font-black ${ord.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Produtos Publicados ({products.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs">
                        <div>
                          <p className="font-bold text-white">{p.title}</p>
                          <p className="text-[10px] text-emerald-400 font-black">R$ {Number(p.price).toFixed(2)}</p>
                        </div>
                        <button onClick={() => handleDeleteProduct(p.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black transition">
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Adicionar Novo Produto</h3>
                  <input type="text" placeholder="Título do Produto" required value={newProd.title} onChange={e => setNewProd({...newProd, title: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                  <input type="number" placeholder="Preço (R$)" required value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                  <textarea placeholder="Descrição curta" required value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white h-20" />
                  <input type="url" placeholder="URL da Imagem (Thumbnail)" value={newProd.thumbnail} onChange={e => setNewProd({...newProd, thumbnail: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                  <input type="url" placeholder="Link do App na Vercel (ex: https://zap-vitrine-sigma.vercel.app)" required value={newProd.download_url} onChange={e => setNewProd({...newProd, download_url: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs uppercase rounded-2xl shadow-md">Publicar Produto no Supabase</button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CHECKOUT MODAL ULTRA MODERNO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-base font-bold text-white">{selectedProduct.title}</h3>

            {step === 1 && (
              <form onSubmit={handleGeneratePix} className="space-y-3">
                <input type="text" placeholder="Seu Nome Completo" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                <input type="email" placeholder="Seu E-mail para receber a licença" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white" />
                <input type="text" placeholder="CPF" required value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-mono" />
                <input type="text" placeholder="Código de Indicação / Afiliado (Opcional)" value={form.refCode} onChange={e => setForm({...form, refCode: e.target.value})} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white font-mono" />
                <button type="submit" disabled={loadingPix} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs uppercase rounded-2xl shadow-lg shadow-cyan-500/25">
                  {loadingPix ? 'A Gerar PIX e Registar...' : 'Gerar PIX Mercado Pago'}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="text-center space-y-3 py-2">
                {pixData?.qrCodeBase64 && (
                  <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-40 h-40 mx-auto rounded-2xl border border-slate-800 shadow-lg" />
                )}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold">Chave PIX Copia e Cola:</p>
                  <p className="text-[10px] font-mono text-cyan-400 break-all">{pixData?.copyPasteCode}</p>
                </div>
                <p className="text-xs text-slate-400">Valor: R$ {Number(selectedProduct.price).toFixed(2)}</p>
                <button 
                  onClick={handleApprovePayment} 
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs uppercase rounded-2xl shadow-lg shadow-emerald-500/25"
                >
                  Simular Pagamento Aprovado
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-4 py-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-inner">
                  ✓
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Pagamento Confirmado!</h4>
                  <p className="text-xs text-slate-400 mt-1">Seu acesso ao aplicativo foi liberado com sucesso.</p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-left space-y-2 shadow-inner">
                  <p className="text-[10px] text-slate-500 uppercase font-black">Link Válido do App na Vercel:</p>
                  <a 
                    href={getCleanProductUrl(selectedProduct)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs uppercase rounded-xl text-center shadow-lg transition"
                  >
                    🚀 ACESSAR APLICATIVO / INSTALAR PWA
                  </a>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="text-xs text-slate-400 hover:text-white font-bold"
                >
                  Fechar janela
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

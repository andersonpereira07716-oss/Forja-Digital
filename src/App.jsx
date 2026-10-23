import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Menu, X, CheckCircle, Zap, ShieldCheck, Download, 
  Star, Copy, ExternalLink, QrCode, CreditCard, Key, Layout, Smartphone, 
  Gamepad2, Layers, Database, Lock, TrendingUp, DollarSign, ShoppingBasket, 
  Users, Tag, Plus, Trash2, Edit, FileText, HelpCircle, Send, Sparkles, 
  MessageCircle, Clock, RefreshCw, Code, Check, ChevronDown, ChevronUp, ArrowRight, Sun, Moon, Award
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'ZapVitrine AI & SaaS Checkout',
    slug: 'zapvitrine-ai-saas-checkout',
    category: 'SaaS / Sistemas',
    price: 197.00,
    originalPrice: 397.00,
    rating: 4.9,
    reviewsCount: 42,
    badge: 'Mais Vendido',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e IA para auto-atendimento.',
    technologies: ['React', 'Node.js', 'Tailwind CSS', 'Supabase'],
    included: ['Código-fonte 100% completo', 'Scripts SQL', 'Documentação passo a passo'],
    downloadFile: 'zapvitrine-ai-v2.4-full.zip',
    salesCount: 184,
    reviews: [
      { name: 'Carlos Mendes', rating: 5, comment: 'Excelente código, implementei para um cliente em Patos e funcionou perfeitamente!' },
      { name: 'Ana Souza', rating: 5, comment: 'Entrega instantânea via PIX e suporte nota 10.' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Pulse Dash - Retro Mobile Game Source',
    slug: 'pulse-dash-retro-game',
    category: 'Jogos Indie',
    price: 89.00,
    originalPrice: 150.00,
    rating: 4.8,
    reviewsCount: 28,
    badge: 'Lançamento',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Kit completo de jogo arcade mobile responsivo construído em HTML5 Canvas + React.',
    technologies: ['React', 'HTML5 Canvas', 'Tailwind CSS'],
    included: ['Código do jogo responsivo', 'Assets em Pixel Art', 'Guia de build APK'],
    downloadFile: 'pulse-dash-mobile-source.zip',
    salesCount: 96,
    reviews: [
      { name: 'Marcos Vinicius', rating: 5, comment: 'Muito fluido e fácil de compilar no Capacitor!' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Sentinela Pro - PWA de Segurança & Monitoramento',
    slug: 'sentinela-pro-pwa-app',
    category: 'Apps Mobile',
    price: 147.00,
    originalPrice: 280.00,
    rating: 5.0,
    reviewsCount: 19,
    badge: 'Destaque UI',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'Template PWA nativo para monitoramento em tempo real, gestão de alertas e dashboards.',
    technologies: ['React', 'PWA', 'Tailwind CSS'],
    included: ['Código PWA completo', 'Push Notifications', 'Modo Dark/Light automático'],
    downloadFile: 'sentinela-pro-pwa-kit.zip',
    salesCount: 112,
    reviews: [
      { name: 'Julio Cesar', rating: 5, comment: 'Arquitetura impecável. Recomendo demais.' }
    ]
  }
];

const INITIAL_COUPONS = [
  { code: 'FORJA10', discountPercent: 10, active: true },
  { code: 'LANCAMENTO20', discountPercent: 20, active: true }
];

const CATEGORIES = ['Todos', 'Landing Pages', 'SaaS / Sistemas', 'Apps Mobile', 'Jogos Indie', 'Kits UI/UX'];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Funcionalidade 4: Tema Dark/Light
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8492',
      customerName: 'Gabriel Silva',
      customerEmail: 'gabriel@exemplo.com',
      customerCpf: '123.456.789-00',
      productTitle: 'ZapVitrine AI & SaaS Checkout',
      productId: 'prod-1',
      downloadFile: 'zapvitrine-ai-v2.4-full.zip',
      pricePaid: 177.30,
      paymentMethod: 'PIX',
      status: 'Aprovado',
      date: '2026-10-23 10:15',
      downloadCount: 1,
      maxDownloads: 5,
      expiresAt: '2026-10-24 10:15',
      licenseKey: 'FORJA-889X-B21Q-99PA' // Funcionalidade 3: Chave de Licença
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('popular');

  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', cpf: '' });
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [pixCopied, setPixCopied] = useState(false);

  const [myPurchasesEmail, setMyPurchasesEmail] = useState('');
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState(null);

  const [adminPin, setAdminPin] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');
  
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.salesCount - a.salesCount;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const openCheckout = (product) => {
    setCheckoutProduct(product);
    setCheckoutStep(1);
    setCustomerForm({ name: '', email: '', cpf: '' });
    setAppliedCoupon('');
    setDiscountPercent(0);
    setCouponError('');
    setActiveOrder(null);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email || !customerForm.cpf) return;

    const finalPrice = checkoutProduct.price * (1 - discountPercent / 100);
    // Funcionalidade 3: Geração automática de chave de licença única
    const generatedKey = `FORJA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-PRO`;

    const newOrd = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerForm.name,
      customerEmail: customerForm.email,
      customerCpf: customerForm.cpf,
      productTitle: checkoutProduct.title,
      productId: checkoutProduct.id,
      downloadFile: checkoutProduct.downloadFile,
      pricePaid: finalPrice,
      paymentMethod: 'PIX',
      status: 'Pendente',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      downloadCount: 0,
      maxDownloads: 5,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 16),
      licenseKey: generatedKey
    };

    setOrders([newOrd, ...orders]);
    setActiveOrder(newOrd);
    setCheckoutStep(2);
  };

  const handleSimulateWebhookApproval = () => {
    if (!activeOrder) return;
    const updatedOrders = orders.map(o => o.id === activeOrder.id ? { ...o, status: 'Aprovado' } : o);
    setOrders(updatedOrders);
    setActiveOrder({ ...activeOrder, status: 'Aprovado' });
    setProducts(products.map(p => p.id === activeOrder.productId ? { ...p, salesCount: p.salesCount + 1 } : p));
  };

  const handleCustomerLogin = (e) => {
    e.preventDefault();
    if (!myPurchasesEmail) return;
    setAuthenticatedCustomer(myPurchasesEmail.toLowerCase().trim());
  };

  const handleDownloadFile = (orderId) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        if (o.downloadCount >= o.maxDownloads) {
          alert('Limite máximo de 5 downloads atingido.');
          return o;
        }
        return { ...o, downloadCount: o.downloadCount + 1 };
      }
      return o;
    }));
    alert('🔐 Token validado. Iniciando download seguro...');
  };

  // Funcionalidade 1: Adicionar Avaliação / Review ao Produto
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText || !selectedProduct) return;

    const updatedReviews = [{ name: newReviewAuthor, rating: 5, comment: newReviewText }, ...(selectedProduct.reviews || [])];
    const updatedProd = { ...selectedProduct, reviews: updatedReviews };

    setSelectedProduct(updatedProd);
    setProducts(products.map(p => p.id === updatedProd.id ? updatedProd : p));
    setNewReviewAuthor('');
    setNewReviewText('');
    alert('Avaliação publicada com sucesso!');
  };

  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'Aprovado').reduce((acc, curr) => acc + curr.pricePaid, 0), [orders]);
  const approvedOrdersCount = useMemo(() => orders.filter(o => o.status === 'Aprovado').length, [orders]);

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black' : 'bg-slate-50 text-slate-900 selection:bg-cyan-400 selection:text-white'}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div onClick={() => { setActiveTab('home'); setSelectedProduct(null); }} className="flex items-center gap-2 cursor-pointer group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
                <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
              </div>
            </div>
            <div>
              <span className={`text-sm sm:text-base font-black tracking-tight flex items-center gap-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                FORJA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">DIGITAL</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 block -mt-1">
                Store Pro
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 font-medium text-xs">
            <button onClick={() => { setActiveTab('home'); setSelectedProduct(null); }} className={`px-2 py-1.5 rounded-lg ${activeTab === 'home' ? 'text-cyan-500 bg-cyan-500/10 font-bold' : darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Início</button>
            <button onClick={() => { setActiveTab('catalog'); setSelectedProduct(null); }} className={`px-2 py-1.5 rounded-lg ${activeTab === 'catalog' ? 'text-cyan-500 bg-cyan-500/10 font-bold' : darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Catálogo</button>
            <button onClick={() => { setActiveTab('my-purchases'); setSelectedProduct(null); }} className={`px-2 py-1.5 rounded-lg ${activeTab === 'my-purchases' ? 'text-cyan-500 bg-cyan-500/10 font-bold' : darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Compras</button>
            <button onClick={() => { setActiveTab('admin'); setSelectedProduct(null); }} className={`px-2 py-1.5 rounded-lg border font-semibold ${activeTab === 'admin' ? 'bg-cyan-500 text-slate-950 border-cyan-500' : darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>Admin</button>
            
            {/* Funcionalidade 4: Botão Dark / Light Mode */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 rounded-xl border ml-2 transition-transform hover:scale-110 ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-300 text-slate-700'}`}
              title="Alternar Tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* BOTÃO DO WHATSAPP */}
      <a 
        href="https://wa.me/5583999999999?text=Ol%C3%A1!%20Gostaria%20de%20suporte%20sobre%20os%20templates." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-5 right-5 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Suporte WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-slate-950" />
      </a>

      {/* MAIN CONTENT AREA */}
      <main className="min-h-[calc(100vh-4rem)] pb-12">
        
        {/* PÁGINA DO PRODUTO + FUNCIONALIDADE 1 (AVALIAÇÕES) */}
        {selectedProduct ? (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <button onClick={() => setSelectedProduct(null)} className="text-xs text-cyan-500 hover:underline font-semibold">← Voltar ao Catálogo</button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div className={`relative rounded-2xl overflow-hidden border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <img src={selectedProduct.thumbnail} alt="" className="w-full h-72 sm:h-96 object-cover object-top" />
                  <span className="absolute top-4 left-4 bg-cyan-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">{selectedProduct.badge}</span>
                </div>

                {/* Seção de Avaliações / Depoimentos (Funcionalidade 1) */}
                <div className={`border p-6 rounded-2xl space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Avaliações de Clientes ({selectedProduct.reviews?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedProduct.reviews?.map((rev, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border text-xs space-y-1 ${darkMode ? 'bg-slate-950 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <div className="flex justify-between font-bold">
                          <span>{rev.name}</span>
                          <div className="flex text-amber-400"><Star className="w-3.5 h-3.5 fill-current" /></div>
                        </div>
                        <p>{rev.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Form para adicionar avaliação */}
                  <form onSubmit={handleAddReview} className="pt-3 border-t border-slate-800/60 space-y-2">
                    <span className="text-xs font-semibold text-slate-400">Deixe seu depoimento:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input type="text" placeholder="Seu Nome" required value={newReviewAuthor} onChange={e => setNewReviewAuthor(e.target.value)} className={`p-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                      <input type="text" placeholder="Sua opinião..." required value={newReviewText} onChange={e => setNewReviewText(e.target.value)} className={`p-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">Enviar Avaliação</button>
                  </form>
                </div>
              </div>

              <div className={`lg:col-span-5 space-y-6 border p-6 sm:p-8 rounded-3xl shadow-2xl self-start ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">{selectedProduct.category}</span>
                  <h1 className={`text-2xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProduct.title}</h1>
                </div>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedProduct.description}</p>
                <div className={`p-4 rounded-2xl border space-y-1 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-xs text-slate-500 line-through font-mono">De R$ {selectedProduct.originalPrice.toFixed(2)}</div>
                  <div className="text-3xl font-black text-emerald-400">R$ {selectedProduct.price.toFixed(2)}</div>
                  <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1"><Zap className="w-3.5 h-3.5 fill-current" /> Liberação automática imediata via PIX</p>
                </div>
                <button onClick={() => openCheckout(selectedProduct)} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl">Comprar Agora com Download Instantâneo</button>
              </div>
            </div>
          </div>
        ) : activeTab === 'home' ? (
          <div className="space-y-16 pb-16">
            <section className="text-center pt-16 pb-8 space-y-6 max-w-4xl mx-auto px-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${darkMode ? 'bg-slate-900 border-slate-800 text-cyan-400' : 'bg-slate-100 border-slate-300 text-cyan-600'}`}><Sparkles className="w-3.5 h-3.5" /> Arquitetura Limpa • Pronta para Produção</div>
              <h1 className={`text-3xl sm:text-6xl font-black tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Templates prontos para você <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">lançar e vender hoje</span></h1>
              <p className={`text-xs sm:text-base max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Códigos-fonte completos de landing pages, saas e apps mobile. Baixe instantaneamente após o PIX.</p>
              <button onClick={() => setActiveTab('catalog')} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl inline-flex items-center gap-2">Explorar Catálogo <ArrowRight className="w-4 h-4" /></button>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Produtos em Destaque</h2>
                  <p className="text-xs text-slate-400">Templates testados e otimizados para produção.</p>
                </div>
                <button onClick={() => setActiveTab('catalog')} className="text-xs text-cyan-500 font-bold flex items-center gap-1">Ver todos <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className={`border rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="space-y-3">
                      <div className={`relative h-44 overflow-hidden rounded-xl ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover object-top" />
                        <span className="absolute top-2.5 left-2.5 bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">{p.badge}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{p.category}</span>
                      <h3 onClick={() => setSelectedProduct(p)} className={`text-base font-bold cursor-pointer hover:text-cyan-500 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.title}</h3>
                      <p className={`text-xs line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{p.description}</p>
                    </div>
                    <div className={`pt-3 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div><span className="text-xs text-slate-500 line-through block font-mono">R$ {p.originalPrice.toFixed(2)}</span><span className="text-lg font-black text-emerald-400">R$ {p.price.toFixed(2)}</span></div>
                      <button onClick={() => openCheckout(p)} className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Comprar</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === 'catalog' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Catálogo de Templates</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className={`border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="space-y-3">
                    <img src={p.thumbnail} alt="" className={`h-44 w-full object-cover object-top rounded-xl ${darkMode ? 'bg-slate-950' : 'bg-slate-100'}`} />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{p.category}</span>
                    <h3 onClick={() => setSelectedProduct(p)} className={`text-base font-bold cursor-pointer ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.title}</h3>
                  </div>
                  <div className={`pt-3 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-lg font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                    <button onClick={() => openCheckout(p)} className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Comprar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'my-purchases' ? (
          <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
            {!authenticatedCustomer ? (
              <form onSubmit={handleCustomerLogin} className={`border p-8 rounded-3xl space-y-4 shadow-2xl text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Minhas Compras</h2>
                <p className="text-xs text-slate-400">Digite seu e-mail cadastrado (Ex: <span className="text-cyan-500 font-mono">gabriel@exemplo.com</span>)</p>
                <input type="email" placeholder="Seu e-mail..." value={myPurchasesEmail} onChange={e => setMyPurchasesEmail(e.target.value)} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} required />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Acessar Downloads</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className={`flex items-center justify-between border-b pb-3 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Seus Downloads & Licenças</h2>
                  <button onClick={() => setAuthenticatedCustomer(null)} className="text-xs text-slate-400 underline">Sair</button>
                </div>
                {orders.filter(o => o.customerEmail.toLowerCase() === authenticatedCustomer).map(ord => (
                  <div key={ord.id} className={`border p-6 rounded-2xl space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{ord.productTitle}</h3>
                    
                    {/* Exibição da Chave de Licença (Funcionalidade 3) */}
                    <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${darkMode ? 'bg-slate-950 border-slate-800 text-cyan-400' : 'bg-slate-50 border-slate-300 text-cyan-600'}`}>
                      <span>Chave: {ord.licenseKey}</span>
                      <button onClick={() => navigator.clipboard.writeText(ord.licenseKey)} className="text-slate-400 hover:text-white" title="Copiar Chave"><Copy className="w-3.5 h-3.5" /></button>
                    </div>

                    <button onClick={() => handleDownloadFile(ord.id)} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Baixar Código (.ZIP)</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'admin' ? (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            {!isAdminAuthenticated ? (
              <form onSubmit={(e) => { e.preventDefault(); if (adminPin === '1234') { setIsAdminAuthenticated(true); } else { setAdminPinError('PIN Incorreto (Tente 1234)'); }}} className={`border p-8 rounded-3xl space-y-4 max-w-sm mx-auto text-center shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Painel Admin (PIN: 1234)</h2>
                <input type="password" maxLength={4} value={adminPin} onChange={e => setAdminPin(e.target.value)} className={`w-full p-3 text-center text-lg tracking-widest font-mono rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                {adminPinError && <p className="text-xs text-rose-400">{adminPinError}</p>}
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Entrar</button>
              </form>
            ) : (
              <div className="space-y-6">
                <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Gestão da Loja & Recuperação de Carrinho</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`border p-5 rounded-2xl space-y-1 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Receita Total</span>
                    <div className="text-2xl font-black text-emerald-400">R$ {totalRevenue.toFixed(2)}</div>
                  </div>
                </div>

                {/* Funcionalidade 2: Carrinhos Abandonados / Pedidos Pendentes com Botão WhatsApp */}
                <div className={`border p-6 rounded-3xl space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pedidos Pendentes / Carrinhos Abandonados</h3>
                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'Pendente').length === 0 ? (
                      <p className="text-xs text-slate-400">Nenhum carrinho pendente no momento.</p>
                    ) : (
                      orders.filter(o => o.status === 'Pendente').map(ord => (
                        <div key={ord.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          <div>
                            <span className="font-bold text-cyan-500">{ord.customerName}</span> ({ord.customerEmail})<br />
                            Produto: <span className="font-bold">{ord.productTitle}</span>
                          </div>
                          {/* Botão de recuperação de carrinho via WhatsApp */}
                          <a 
                            href={`https://wa.me/55?text=Ol%C3%A1%20${encodeURIComponent(ord.customerName)}!%20Notamos%20que%20voc%C3%AA%20iniciou%20a%20compra%20do%20template%20*${encodeURIComponent(ord.productTitle)}*%20na%20Forja%20Digital%20mas%20n%C3%A3o%20concluiu.%20Precisa%20de%20ajuda%20com%20o%20PIX?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" /> Recuperar via WhatsApp
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        ) : null}
      </main>

      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Checkout Seguro</h2>
            {checkoutStep === 1 ? (
              <form onSubmit={handleProcessPayment} className="space-y-3">
                <input type="text" placeholder="Nome Completo" required value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                <input type="email" placeholder="Seu E-mail" required value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                <input type="text" placeholder="CPF" required value={customerForm.cpf} onChange={e => setCustomerForm({...customerForm, cpf: e.target.value})} className={`w-full p-3 rounded-xl text-xs border font-mono ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'}`} />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Gerar PIX</button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <QrCode className="w-32 h-32 text-cyan-500 mx-auto" />
                <button onClick={handleSimulateWebhookApproval} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl">Simular Aprovação (Webhook)</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

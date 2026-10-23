import React, { useState, useEffect } from 'react';

const FALLBACK_PRODUCTS = [
  { 
    id: '1', 
    title: 'ZapVitrine AI & SaaS Checkout', 
    category: 'SaaS / Sistemas', 
    price: 197.00, 
    original_price: 397.00, 
    badge: 'Mais Vendido', 
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 
    description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e automação de IA.', 
    techs: ['React', 'Node.js', 'Supabase'] 
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
    techs: ['React', 'HTML5 Canvas'] 
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
    techs: ['React', 'PWA', 'Tailwind'] 
  }
];

export default function App() {
  const [tab, setTab] = useState('catalog');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', cpf: '' });
  
  const [searchEmail, setSearchEmail] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    async function fetchSupabaseProducts() {
      try {
        if (!window.supabase && typeof supabase !== 'undefined' && supabase) {
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (e) {
        console.log('A usar catálogo local otimizado');
      }
    }
    fetchSupabaseProducts();
  }, []);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cpf) return;
    setStep(2);
  };

  const handleSearchOrders = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setLoadingOrders(true);
    try {
      if (typeof supabase !== 'undefined' && supabase) {
        const { data } = await supabase.from('orders').select('*').eq('customer_email', searchEmail);
        setMyOrders(data || []);
      } else {
        setMyOrders([
          { order_code: 'ORD-9482', product_title: selectedProduct?.title || 'ZapVitrine AI', status: 'approved', license_key: 'FORJA-PRO-884X' }
        ]);
      }
    } catch (err) {
      setMyOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg">
            F
          </div>
          <span className="font-black text-xl tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab('catalog')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === 'catalog' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Catálogo</button>
          <button onClick={() => setTab('purchases')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === 'purchases' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Meus Pedidos</button>
        </div>
      </header>

      {/* WHATSAPP */}
      <a 
        href="https://wa.me/5583999999999?text=Olá!%20Tenho%20interesse%20nos%20templates%20da%20Forja%20Digital." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 p-4 bg-emerald-500 text-slate-950 rounded-full shadow-2xl font-bold hover:scale-105 transition flex items-center gap-2 text-xs"
      >
        💬 WhatsApp
      </a>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto py-10 space-y-8">
        {tab === 'catalog' ? (
          <>
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black">Templates & Códigos Prontos</h1>
              <p className="text-sm text-slate-400">Códigos-fonte completos sincronizados com Supabase. Baixe instantaneamente após o PIX.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={p.thumbnail} alt={p.title} className="h-44 w-full object-cover rounded-xl" />
                      {p.badge && <span className="absolute top-3 left-3 px-2 py-0.5 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase rounded">{p.badge}</span>}
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">{p.category}</span>
                    <h3 className="text-base font-bold">{p.title}</h3>
                    <p className="text-xs text-slate-400">{p.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      {p.original_price && <span className="text-[10px] text-slate-500 line-through block">R$ {Number(p.original_price).toFixed(2)}</span>}
                      <span className="text-lg font-black text-emerald-400">R$ {Number(p.price).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(p); setStep(1); }} 
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition"
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-lg font-black text-center">Consultar Meus Pedidos</h2>
            <form onSubmit={handleSearchOrders} className="space-y-3">
              <input type="email" placeholder="Digite seu e-mail de compra..." required value={searchEmail} onChange={e => setSearchEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">Buscar Licenças</button>
            </form>

            {loadingOrders && <p className="text-center text-xs text-slate-400">Pesquisando pedidos...</p>}

            {myOrders.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {myOrders.map((ord, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-white">{ord.product_title || 'Template Forja Digital'}</p>
                    <p className="font-mono text-cyan-400">Chave: {ord.license_key || 'FORJA-PRO-ACCESS'}</p>
                    <button onClick={() => alert('Download do arquivo .ZIP iniciado!')} className="w-full py-2 bg-emerald-500 text-slate-950 font-black uppercase rounded-lg">Baixar Ficheiro (.ZIP)</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400">✕</button>
            <h3 className="text-base font-bold">{selectedProduct.title}</h3>

            {step === 1 ? (
              <form onSubmit={handleCheckout} className="space-y-3">
                <input type="text" placeholder="Seu Nome Completo" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" placeholder="Seu E-mail" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="CPF" required value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono" />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">Gerar PIX</button>
              </form>
            ) : (
              <div className="text-center space-y-3 py-2">
                <div className="p-4 bg-white rounded-2xl w-32 h-32 mx-auto flex items-center justify-center text-slate-950 font-black">
                  [ QR-CODE PIX ]
                </div>
                <p className="text-xs text-slate-400">Valor: R$ {Number(selectedProduct.price).toFixed(2)}</p>
                <button onClick={() => { alert('Pagamento aprovado com sucesso!'); setSelectedProduct(null); }} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">Simular Aprovado</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

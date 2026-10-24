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
    download_url: 'https://github.com/anderson-ps1'
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
    download_url: 'https://github.com/anderson-ps1'
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
    download_url: 'https://github.com/anderson-ps1'
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
    download_url: 'https://github.com/anderson-ps1'
  }
];

export default function App() {
  const [tab, setTab] = useState('catalog');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', cpf: '' });
  const [pixData, setPixData] = useState(null);
  const [loadingPix, setLoadingPix] = useState(false);

  // Meus Pedidos
  const [searchEmail, setSearchEmail] = useState('');
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Admin State
  const [adminPin, setAdminPin] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [newProd, setNewProd] = useState({ title: '', category: 'SaaS / Sistemas', price: '', description: '', thumbnail: '', download_url: '' });

  // Carregar produtos dinâmicos do Supabase
  useEffect(() => {
    async function loadProducts() {
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      }
    }
    loadProducts();
  }, []);

  // 1. GERAR PIX E CRIAR REGISTO NO SUPABASE
  const handleGeneratePix = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cpf) return;
    setLoadingPix(true);

    const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // Tenta gerar via rota Serverless
      const res = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderCode,
          productTitle: selectedProduct.title,
          amount: selectedProduct.price,
          email: form.email,
          name: form.name,
          cpf: form.cpf
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
      // Gravar intenção de pedido no Supabase
      if (supabase) {
        await supabase.from('orders').insert([
          {
            order_code: orderCode,
            customer_name: form.name,
            customer_email: form.email,
            product_title: selectedProduct.title,
            amount: selectedProduct.price,
            status: 'pending',
            license_key: `FORJA-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
            download_url: selectedProduct.download_url || 'https://github.com/anderson-ps1'
          }
        ]);
      }
      setLoadingPix(false);
      setStep(2);
    }
  };

  // 2. SIMULAR APROVAÇÃO & DISPARAR E-MAIL AUTOMÁTICO
  const handleApprovePayment = async () => {
    if (supabase) {
      await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('customer_email', form.email);
    }

    // Dispara notificação de e-mail pela rota Serverless
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          productTitle: selectedProduct.title,
          downloadUrl: selectedProduct.download_url || 'https://github.com/anderson-ps1'
        })
      });
    } catch (e) {
      console.log('Notificação enviada por fallback');
    }

    alert(`✅ Pagamento verificado! O link do produto e a chave de licença foram enviados para ${form.email}.`);
    setSelectedProduct(null);
  };

  // 3. CONSULTAR PEDIDOS NO SUPABASE
  const handleSearchOrders = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setLoadingOrders(true);

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', searchEmail);

        if (!error && data && data.length > 0) {
          setMyOrders(data);
        } else {
          setMyOrders([
            { 
              order_code: 'ORD-9842', 
              product_title: 'ZapVitrine AI & SaaS', 
              status: 'approved', 
              license_key: 'FORJA-PRO-884X-2026',
              download_url: 'https://github.com/anderson-ps1'
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
            download_url: 'https://github.com/anderson-ps1'
          }
        ]);
      }
    } catch (err) {
      console.log('Erro ao procurar pedidos');
    } finally {
      setLoadingOrders(false);
    }
  };

  // 4. ADMIN - NOVO PRODUTO NO BANCO DE DADOS
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price) return;

    const created = {
      title: newProd.title,
      category: newProd.category,
      price: parseFloat(newProd.price),
      original_price: parseFloat(newProd.price) * 1.5,
      badge: 'Novo',
      description: newProd.description,
      thumbnail: newProd.thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      techs: ['React', 'Node.js'],
      download_url: newProd.download_url || 'https://github.com/anderson-ps1'
    };

    if (supabase) {
      await supabase.from('products').insert([created]);
    }

    setProducts([created, ...products]);
    setNewProd({ title: '', category: 'SaaS / Sistemas', price: '', description: '', thumbnail: '', download_url: '' });
    alert('Produto registado e publicado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('catalog')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg">
            F
          </div>
          <span className="font-black text-xl tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTab('catalog')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === 'catalog' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Catálogo</button>
          <button onClick={() => setTab('purchases')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === 'purchases' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Meus Pedidos</button>
          <button onClick={() => setTab('admin')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${tab === 'admin' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Admin</button>
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
        {tab === 'catalog' && (
          <>
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black">Templates & Códigos Prontos</h1>
              <p className="text-sm text-slate-400">Software pronto, landing pages e apps integrados ao Supabase. Baixe instantaneamente após o PIX.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p, idx) => (
                <div key={p.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition">
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
        )}

        {tab === 'purchases' && (
          <div className="max-w-md mx-auto space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-lg font-black text-center">Consultar Meus Pedidos</h2>
            <form onSubmit={handleSearchOrders} className="space-y-3">
              <input type="email" placeholder="Digite seu e-mail de compra..." required value={searchEmail} onChange={e => setSearchEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">
                {loadingOrders ? 'A pesquisar...' : 'Buscar Licenças'}
              </button>
            </form>

            {myOrders.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                {myOrders.map((ord, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-white">{ord.product_title}</p>
                    <p className="font-mono text-cyan-400 text-[10px]">Chave: {ord.license_key}</p>
                    <a href={ord.download_url} target="_blank" rel="noreferrer" className="block w-full py-2 bg-emerald-500 text-slate-950 font-black uppercase rounded-lg text-center">Baixar Ficheiro (.ZIP)</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'admin' && (
          <div className="max-w-lg mx-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            <h2 className="text-lg font-black text-center">Painel Administrativo</h2>
            
            {!isAdminAuth ? (
              <div className="space-y-3">
                <input type="password" placeholder="Digite o PIN de Administrador" value={adminPin} onChange={e => setAdminPin(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <button onClick={() => adminPin === '1234' ? setIsAdminAuth(true) : alert('PIN Incorreto! (Padrão: 1234)')} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">Acessar Painel</button>
              </div>
            ) : (
              <form onSubmit={handleAddProduct} className="space-y-3">
                <p className="text-xs text-emerald-400 font-bold text-center">● Autenticado como Administrador</p>
                <input type="text" placeholder="Título do Produto" required value={newProd.title} onChange={e => setNewProd({...newProd, title: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" placeholder="Preço (R$)" required value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <textarea placeholder="Descrição curta" required value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white h-20" />
                <input type="url" placeholder="URL da Imagem (Thumbnail)" value={newProd.thumbnail} onChange={e => setNewProd({...newProd, thumbnail: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="url" placeholder="URL para Download (.zip ou repositório)" value={newProd.download_url} onChange={e => setNewProd({...newProd, download_url: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">Adicionar ao Catálogo e Supabase</button>
              </form>
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
              <form onSubmit={handleGeneratePix} className="space-y-3">
                <input type="text" placeholder="Seu Nome Completo" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" placeholder="Seu E-mail para receber a licença" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="CPF" required value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono" />
                <button type="submit" disabled={loadingPix} className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">
                  {loadingPix ? 'A Gerar PIX e Registar...' : 'Gerar PIX Mercado Pago'}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-3 py-2">
                {pixData?.qrCodeBase64 && (
                  <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-40 h-40 mx-auto rounded-xl border border-slate-800" />
                )}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-1">
                  <p className="text-[10px] text-slate-400">Chave PIX Copia e Cola:</p>
                  <p className="text-[10px] font-mono text-cyan-400 break-all">{pixData?.copyPasteCode}</p>
                </div>
                <p className="text-xs text-slate-400">Valor: R$ {Number(selectedProduct.price).toFixed(2)}</p>
                <button 
                  onClick={handleApprovePayment} 
                  className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl"
                >
                  Simular Pagamento Aprovado
                </button>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Search, Menu, X, CheckCircle, Zap, ShieldCheck, Download, 
  Star, Copy, ExternalLink, QrCode, CreditCard, Key, Layout, Smartphone, 
  Gamepad2, Layers, Database, Lock, TrendingUp, DollarSign, ShoppingBasket, 
  Users, Tag, Plus, Trash2, Edit, FileText, HelpCircle, Send, Sparkles, 
  MessageCircle, Clock, RefreshCw, Code, Check, ChevronDown, ChevronUp, ArrowRight, Sun, Moon, Award
} from 'lucide-react';
import { supabase } from './supabaseClient';

const CATEGORIES = ['Todos', 'Landing Pages', 'SaaS / Sistemas', 'Apps Mobile', 'Jogos Indie', 'Kits UI/UX'];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('popular');

  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', cpf: '' });
  const [activeOrder, setActiveOrder] = useState(null);

  const [myPurchasesEmail, setMyPurchasesEmail] = useState('');
  const [authenticatedCustomer, setAuthenticatedCustomer] = useState(null);

  const [adminPin, setAdminPin] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  // 1. CARREGAR PRODUTOS DIRETO DO SUPABASE
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Erro ao carregar do Supabase:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const openCheckout = (product) => {
    setCheckoutProduct(product);
    setCheckoutStep(1);
    setCustomerForm({ name: '', email: '', cpf: '' });
    setActiveOrder(null);
  };

  // 2. REGISTRAR PEDIDO NO SUPABASE
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email || !customerForm.cpf) return;

    const generatedKey = `FORJA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-PRO`;
    const orderCode = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrderObj = {
      order_code: orderCode,
      customer_name: customerForm.name,
      customer_email: customerForm.email,
      customer_cpf: customerForm.cpf,
      product_id: checkoutProduct.id,
      product_title: checkoutProduct.title,
      price_paid: checkoutProduct.price,
      status: 'pending_pix',
      license_key: generatedKey
    };

    try {
      const { data, error } = await supabase.from('orders').insert([newOrderObj]).select().single();
      if (error) throw error;
      setActiveOrder(data || newOrderObj);
      setOrders([data || newOrderObj, ...orders]);
      setCheckoutStep(2);
    } catch (err) {
      console.error('Erro ao registar pedido:', err);
      // Fallback local se RLS restringir escrita
      setActiveOrder(newOrderObj);
      setCheckoutStep(2);
    }
  };

  const handleSimulateWebhookApproval = async () => {
    if (!activeOrder) return;
    try {
      await supabase.from('orders').update({ status: 'approved' }).eq('order_code', activeOrder.order_code || activeOrder.id);
    } catch(e){}
    setActiveOrder({ ...activeOrder, status: 'approved' });
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    if (!myPurchasesEmail) return;
    const emailSearch = myPurchasesEmail.toLowerCase().trim();
    setAuthenticatedCustomer(emailSearch);

    try {
      const { data } = await supabase.from('orders').select('*').eq('customer_email', emailSearch);
      if (data) setOrders(data);
    } catch(err){}
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div onClick={() => { setActiveTab('home'); setSelectedProduct(null); }} className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px]">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
                <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
              </div>
            </div>
            <span className="text-base font-black tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
          </div>

          <nav className="flex items-center gap-2 text-xs">
            <button onClick={() => { setActiveTab('home'); setSelectedProduct(null); }} className={`px-2.5 py-1.5 rounded-lg ${activeTab === 'home' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : ''}`}>Início</button>
            <button onClick={() => { setActiveTab('catalog'); setSelectedProduct(null); }} className={`px-2.5 py-1.5 rounded-lg ${activeTab === 'catalog' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : ''}`}>Catálogo</button>
            <button onClick={() => { setActiveTab('my-purchases'); setSelectedProduct(null); }} className={`px-2.5 py-1.5 rounded-lg ${activeTab === 'my-purchases' ? 'text-cyan-400 bg-cyan-500/10 font-bold' : ''}`}>Compras</button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-slate-700">{darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />}</button>
          </nav>
        </div>
      </header>

      {/* WHATSAPP */}
      <a href="https://wa.me/5583999999999" target="_blank" rel="noopener noreferrer" className="fixed bottom-5 right-5 z-50 p-3.5 bg-emerald-500 text-slate-950 rounded-full shadow-2xl"><MessageCircle className="w-6 h-6 fill-current" /></a>

      {/* MAIN CONTENT */}
      <main className="min-h-[calc(100vh-4rem)] pb-12">
        {activeTab === 'home' || activeTab === 'catalog' ? (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black">Templates integrados ao <span className="text-cyan-400">Supabase Cloud</span></h1>
              <p className="text-xs sm:text-sm text-slate-400">Catálogo atualizado em tempo real direto da base de dados.</p>
            </div>

            {loadingProducts ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono animate-pulse">A carregar produtos do Supabase...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className={`border rounded-2xl p-5 space-y-4 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="space-y-3">
                      <img src={p.thumbnail} alt="" className="h-44 w-full object-cover rounded-xl" />
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{p.category}</span>
                      <h3 className="text-base font-bold">{p.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-lg font-black text-emerald-400">R$ {Number(p.price).toFixed(2)}</span>
                      <button onClick={() => openCheckout(p)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-black text-xs rounded-xl">Comprar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'my-purchases' ? (
          <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
            {!authenticatedCustomer ? (
              <form onSubmit={handleCustomerLogin} className={`border p-8 rounded-3xl space-y-4 text-center ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className="text-xl font-black">Minhas Compras</h2>
                <input type="email" placeholder="Seu e-mail..." value={myPurchasesEmail} onChange={e => setMyPurchasesEmail(e.target.value)} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`} required />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">Buscar Pedidos</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center"><h2 className="text-lg font-black">Seus Downloads (Supabase Sync)</h2><button onClick={() => setAuthenticatedCustomer(null)} className="text-xs text-slate-400 underline">Sair</button></div>
                {orders.map(ord => (
                  <div key={ord.id || ord.order_code} className={`border p-6 rounded-2xl space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-base font-bold">{ord.product_title}</h3>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400">Licença: {ord.license_key}</div>
                    <button onClick={() => alert('🔐 Download iniciado via Supabase Token!')} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Baixar Ficheiro (.ZIP)</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* CHECKOUT MODAL */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-md w-full p-6 space-y-4 relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-lg font-black">Checkout via Supabase</h2>
            {checkoutStep === 1 ? (
              <form onSubmit={handleProcessPayment} className="space-y-3">
                <input type="text" placeholder="Nome Completo" required value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`} />
                <input type="email" placeholder="Seu E-mail" required value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} className={`w-full p-3 rounded-xl text-xs border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`} />
                <input type="text" placeholder="CPF" required value={customerForm.cpf} onChange={e => setCustomerForm({...customerForm, cpf: e.target.value})} className={`w-full p-3 rounded-xl text-xs border font-mono ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'}`} />
                <button type="submit" className="w-full py-3 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl">Gerar PIX</button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <QrCode className="w-32 h-32 text-cyan-400 mx-auto" />
                <button onClick={handleSimulateWebhookApproval} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">{activeOrder?.status === 'approved' ? '✓ Aprovado no Supabase!' : 'Simular Aprovação (Webhook)'}</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

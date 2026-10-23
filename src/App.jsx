import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Download, X, QrCode, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from './supabaseClient';

const PRODUCTS = [
  { id: '1', title: 'ZapVitrine AI & SaaS Checkout', category: 'SaaS / Sistemas', price: 197.00, original_price: 397.00, badge: 'Mais Vendido', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e IA.', technologies: ['React', 'Node.js', 'Supabase'] },
  { id: '2', title: 'Pulse Dash - Retro Mobile Game Source', category: 'Jogos Indie', price: 89.00, original_price: 150.00, badge: 'Lançamento', thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', description: 'Kit completo de jogo arcade mobile responsivo construído em HTML5 Canvas + React.', technologies: ['React', 'HTML5 Canvas'] },
  { id: '3', title: 'Sentinela Pro - PWA Segurança', category: 'Apps Mobile', price: 147.00, original_price: 280.00, badge: 'Destaque UI', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', description: 'Template PWA nativo para monitoramento em tempo real, gestão de alertas e dashboards.', technologies: ['React', 'PWA', 'Tailwind'] }
];

export default function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customer, setCustomer] = useState({ name: '', email: '', cpf: '' });

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log('A usar catálogo padrão');
      }
    }
    loadData();
  }, []);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.cpf) return;
    setCheckoutStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-800 bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <span className="text-base font-black tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> STORE PRO
          </span>
        </div>
      </header>

      <a href="https://wa.me/5583999999999?text=Olá,%20gostaria%20de%20tirar%20dúvidas%20sobre%20os%20templates%20da%20Forja%20Digital!" target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-50 p-4 bg-emerald-500 text-slate-950 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Arquitetura Limpa • Pronta para Produção
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Templates Prontos para Você <span className="text-cyan-400">Lançar e Vender Hoje</span></h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">Códigos-fonte completos de landing pages, saas e apps mobile. Baixe instantaneamente após o PIX.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition duration-300 shadow-xl">
              <div className="space-y-3">
                <div className="relative">
                  <img src={p.thumbnail} alt={p.title} className="h-44 w-full object-cover rounded-xl" />
                  {p.badge && <span className="absolute top-3 left-3 px-2.5 py-1 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-lg shadow">{p.badge}</span>}
                </div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{p.category}</span>
                <h3 className="text-base font-bold leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
                {p.technologies && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.technologies.map((tech, i) => (
                      <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-md text-slate-300 border border-slate-800">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  {p.original_price && <span className="text-[10px] text-slate-500 line-through block">R$ {Number(p.original_price).toFixed(2)}</span>}
                  <span className="text-lg font-black text-emerald-400">R$ {Number(p.price).toFixed(2)}</span>
                </div>
                <button onClick={() => { setSelectedProduct(p); setCheckoutStep(1); }} className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-cyan-500/20">COMPRAR</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Checkout Seguro</span>
              <h2 className="text-lg font-black">{selectedProduct.title}</h2>
            </div>

            {checkoutStep === 1 ? (
              <form onSubmit={handleCheckout} className="space-y-3">
                <input type="text" placeholder="Seu Nome Completo" required value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="email" placeholder="Seu E-mail para receber a licença" required value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500" />
                <input type="text" placeholder="CPF (Apenas números)" required value={customer.cpf} onChange={e => setCustomer({...customer, cpf: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500" />
                
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total a pagar:</span>
                  <span className="font-black text-emerald-400 text-sm">R$ {Number(selectedProduct.price).toFixed(2)}</span>
                </div>

                <button type="submit" className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl transition shadow-lg shadow-cyan-500/20">Gerar PIX Instantâneo</button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center border border-slate-800">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-cyan-400 break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px]">00020126580014br.gov.bcb.pix...</p>
                  <p className="text-[11px] text-slate-400">Escaneie o QR Code com o aplicativo do seu banco</p>
                </div>
                <button onClick={() => { alert('Pagamento simulado com sucesso! Chave enviada por e-mail.'); setSelectedProduct(null); }} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Simular Pagamento Aprovado
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

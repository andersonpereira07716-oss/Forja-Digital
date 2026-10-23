import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  { 
    id: '1', 
    title: 'ZapVitrine AI & SaaS Checkout', 
    category: 'SaaS / Sistemas', 
    price: 197.00, 
    original_price: 397.00, 
    badge: 'Mais Vendido', 
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', 
    description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e automação.', 
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
  const [products, setProducts] = useState(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', cpf: '' });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg">
            F
          </div>
          <span className="font-black text-xl tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-3 py-1 rounded-full border border-emerald-500/20">
          ● STORE PRO
        </span>
      </header>

      {/* WHATSAPP */}
      <a 
        href="https://wa.me/5583999999999?text=Olá!%20Tenho%20interesse%20nos%20templates%20da%20Forja%20Digital." 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 p-4 bg-emerald-500 text-slate-950 rounded-full shadow-2xl font-bold hover:scale-105 transition"
      >
        💬 WhatsApp
      </a>

      {/* CATÁLOGO */}
      <main className="max-w-7xl mx-auto py-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Templates & Códigos Prontos</h1>
          <p className="text-sm text-slate-400">Códigos-fonte completos de landing pages, saas e apps mobile. Baixe instantaneamente após o PIX.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition">
              <div className="space-y-3">
                <div className="relative">
                  <img src={p.thumbnail} alt={p.title} className="h-44 w-full object-cover rounded-xl" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase rounded">{p.badge}</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase">{p.category}</span>
                <h3 className="text-base font-bold">{p.title}</h3>
                <p className="text-xs text-slate-400">{p.description}</p>
                <div className="flex gap-1">
                  {p.techs.map((t, i) => (
                    <span key={i} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 border border-slate-800">{t}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 line-through block">R$ {p.original_price.toFixed(2)}</span>
                  <span className="text-lg font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
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
      </main>

      {/* CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400">✕</button>
            <h3 className="text-base font-bold">{selectedProduct.title}</h3>

            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-3">
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
                <p className="text-xs text-slate-400">Valor: R$ {selectedProduct.price.toFixed(2)}</p>
                <button onClick={() => { alert('Pagamento aprovado!'); setSelectedProduct(null); }} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">Simular Aprovado</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

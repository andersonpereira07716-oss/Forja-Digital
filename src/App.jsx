import React, { useState, useEffect } from 'react';

const PRODUCTS = [
  { id: '1', title: 'ZapVitrine AI & SaaS Checkout', category: 'SaaS / Sistemas', price: 197.00, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', description: 'Sistema completo de catálogo para WhatsApp com checkout integrado e IA.' },
  { id: '2', title: 'Pulse Dash - Retro Mobile Game Source', category: 'Jogos Indie', price: 89.00, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', description: 'Kit completo de jogo arcade mobile responsivo em HTML5 Canvas + React.' },
  { id: '3', title: 'Sentinela Pro - PWA Segurança', category: 'Apps Mobile', price: 147.00, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', description: 'Template PWA nativo para monitoramento em tempo real e telemetria.' }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8">
      <header className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center font-black text-slate-950">F</div>
          <span className="font-black text-xl tracking-tight">FORJA<span className="text-cyan-400">DIGITAL</span></span>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-3 py-1 rounded-full border border-emerald-500/20">● ONLINE</span>
      </header>

      <main className="max-w-7xl mx-auto py-10 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">Templates & Códigos Prontos</h1>
          <p className="text-sm text-slate-400">Códigos-fonte completos de landing pages, saas e apps mobile.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <img src={p.thumbnail} alt={p.title} className="h-44 w-full object-cover rounded-xl" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{p.category}</span>
                <h3 className="text-base font-bold">{p.title}</h3>
                <p className="text-xs text-slate-400">{p.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-lg font-black text-emerald-400">R$ {p.price.toFixed(2)}</span>
                <button onClick={() => setSelectedProduct(p)} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition">COMPRAR</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 text-center relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-slate-400 text-sm">✕</button>
            <h3 className="text-base font-bold">{selectedProduct.title}</h3>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">Valor da compra:</p>
              <p className="text-2xl font-black text-emerald-400">R$ {selectedProduct.price.toFixed(2)}</p>
            </div>
            <button onClick={() => { alert('Pedido gerado com sucesso!'); setSelectedProduct(null); }} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">Confirmar PIX</button>
          </div>
        </div>
      )}
    </div>
  );
}

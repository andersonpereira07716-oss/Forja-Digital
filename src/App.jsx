import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Sun, Moon, Download, X, QrCode } from 'lucide-react';
import { supabase } from './supabaseClient';

const INITIAL_PRODUCTS = [
  { id: '1', title: 'ZapVitrine AI & SaaS Checkout', category: 'SaaS / Sistemas', price: 197.00, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', description: 'Sistema completo de catálogo para WhatsApp com checkout integrado.' },
  { id: '2', title: 'Pulse Dash - Retro Mobile Game Source', category: 'Jogos Indie', price: 89.00, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', description: 'Kit completo de jogo arcade mobile responsivo em HTML5 Canvas.' },
  { id: '3', title: 'Sentinela Pro - PWA Segurança', category: 'Apps Mobile', price: 147.00, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', description: 'Template PWA nativo para monitoramento em tempo real.' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn("Usando fallback de produtos");
      }
    }
    loadData();
  }, []);

  return (
    <div className={`min-h-screen font-sans antialiased ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <span className="font-black text-lg">FORJA<span className="text-cyan-400">DIGITAL</span></span>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-slate-700">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black">Templates & Códigos Prontos</h1>
          <p className="text-xs text-slate-400">Baixe instantaneamente após o PIX.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className={`border rounded-2xl p-4 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="space-y-3">
                <img src={p.thumbnail} alt="" className="h-40 w-full object-cover rounded-xl" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase">{p.category}</span>
                <h3 className="text-base font-bold">{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-lg font-black text-emerald-400">R$ {Number(p.price).toFixed(2)}</span>
                <button onClick={() => setCheckoutProduct(p)} className="px-4 py-2 bg-cyan-500 text-slate-950 font-black text-xs rounded-xl">Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {checkoutProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-sm w-full p-6 space-y-4 relative ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setCheckoutProduct(null)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5" /></button>
            <h2 className="text-base font-black">Checkout - {checkoutProduct.title}</h2>
            <div className="text-center space-y-3">
              <QrCode className="w-28 h-28 text-cyan-400 mx-auto" />
              <p className="text-xs text-slate-400">Escaneie o PIX para finalizar</p>
              <button onClick={() => { alert('Pagamento Aprovado!'); setCheckoutProduct(null); }} className="w-full py-3 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-xl">Simular Aprovação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

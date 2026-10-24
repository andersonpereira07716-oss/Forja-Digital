import React, { useState } from 'react';
import { products } from './data/products';
import { ShieldAlert, Zap, ShoppingCart, MessageCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalogo');

  return (
    <div className="min-h-screen bg-[#070b19] text-white font-sans pb-20">
      {/* Header */}
      <header className="p-4 flex flex-col items-center border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-black text-xl shadow-lg">
            F
          </div>
          <span className="text-xl font-black tracking-wider bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            FORJADIGITAL
          </span>
        </div>
        <div className="flex bg-[#111827] p-1 rounded-2xl border border-gray-800 w-full max-w-md justify-around">
          <button 
            onClick={() => setActiveTab('catalogo')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'catalogo' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            CATÁLOGO
          </button>
          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'pedidos' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            MEUS PEDIDOS
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'admin' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            ADMIN
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 mt-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-[#0f2744] text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
            ⚡ ECOSSISTEMA SAAS & PWA ENTERPRISE
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Soluções Inteligentes em IA</h1>
          <p className="text-gray-400 text-sm">Ferramentas de alta performance para automatizar o seu negócio e garantir segurança jurídica.</p>
        </div>

        {/* Product List */}
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-cyan-500/50">
              <div className="relative h-48 bg-gray-900 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-cyan-400 text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-lg">
                  {product.badge}
                </span>
              </div>
              <div className="p-5">
                <span className="text-cyan-400 text-xs font-bold tracking-wider">{product.category}</span>
                <h3 className="text-xl font-bold mt-1 mb-2">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    {product.originalPrice && (
                      <span className="text-gray-500 text-xs line-through block">{product.originalPrice}</span>
                    )}
                    <span className="text-2xl font-black text-cyan-400">{product.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors"
                      title="Abrir Aplicação"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <a 
                      href={product.checkoutLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-extrabold rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      COMPRAR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer / WhatsApp Float */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-black font-bold px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          <MessageCircle size={20} />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

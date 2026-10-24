import React, { useState } from 'react';
import { Sparkles, FileText, ArrowRight, Copy, Check } from 'lucide-react';

export default function LegaleseTranslator() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/translate-legalese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      
      const data = await response.json();
      setTranslatedText(data.result || 'Erro ao traduzir o texto jurídico.');
    } catch (error) {
      console.error('Erro:', error);
      setTranslatedText('Tradução simulada: O contrato diz que você concorda com os termos estipulados.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          <Sparkles size={14} /> IA Powered Translation
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Legalese Translator</h2>
        <p className="text-slate-400 text-sm">Cole contratos ou textos jurídicos complexos para traduzi-los em linguagem simples.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
            <FileText size={14} /> Texto Jurídico Original
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole o juridiquês aqui..."
            rows={8}
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none text-sm"
          />
          <button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {loading ? 'Traduzindo com IA...' : 'Traduzir para Linguagem Simples'} <ArrowRight size={16} />
          </button>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
              <Sparkles size={14} /> Tradução Descomplicada
            </label>
            {translatedText && (
              <button onClick={copyToClipboard} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado!' : 'Copiar'}
              </button>
            )}
          </div>
          <div className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 min-h-[200px] max-h-[250px] overflow-y-auto text-sm">
            {translatedText ? <p className="whitespace-pre-wrap">{translatedText}</p> : <span className="text-slate-600 italic">O resultado traduzido aparecerá aqui...</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

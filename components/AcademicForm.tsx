
import React, { useState } from 'react';
import { PaperType, PaperRequest } from '../types';

interface AcademicFormProps {
  onSubmit: (data: PaperRequest) => void;
  isLoading: boolean;
}

export const AcademicForm: React.FC<AcademicFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PaperRequest>({
    title: '',
    objective: '',
    type: PaperType.TCC,
    language: 'Português (Brasil)'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.objective) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white neo-brutalism-static p-6 md:p-10 space-y-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-800"></div>
      
      <section className="space-y-6">
        <h2 className="text-3xl font-black italic uppercase border-b-4 border-black pb-4 text-slate-900 flex items-center gap-3">
          <span className="text-blue-800">01.</span> A Pesquisa
        </h2>
        
        <div className="space-y-3">
          <label className="block text-xs font-black uppercase text-blue-800 tracking-widest">Título Provisório</label>
          <input
            required
            type="text"
            className="w-full border-2 border-black p-5 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all placeholder-slate-400"
            placeholder="Ex: Inteligência Artificial na Educação do Futuro"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-black uppercase text-purple-800 tracking-widest">Objetivo da Investigação</label>
          <textarea
            required
            rows={4}
            className="w-full border-2 border-black p-5 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all placeholder-slate-400"
            placeholder="Qual o problema ou meta principal do seu trabalho?"
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-black italic uppercase border-b-4 border-black pb-4 text-slate-900 flex items-center gap-3">
          <span className="text-blue-800">02.</span> Parâmetros
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-700">Categoria de Publicação</label>
            <div className="relative">
              <select
                className="w-full border-2 border-black p-5 font-black uppercase text-sm appearance-none bg-white cursor-pointer focus:ring-4 focus:ring-slate-100"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PaperType })}
              >
                {Object.values(PaperType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none font-black">▼</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-700">Normatização (Idioma)</label>
            <div className="relative">
              <select
                className="w-full border-2 border-black p-5 font-black uppercase text-sm appearance-none bg-white cursor-pointer focus:ring-4 focus:ring-slate-100"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option>Português (Brasil)</option>
                <option>English (Academic)</option>
                <option>Español (Académico)</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none font-black">▼</div>
            </div>
          </div>
        </div>
      </section>

      <button
        disabled={isLoading}
        type="submit"
        className={`w-full p-8 text-3xl comic-font uppercase italic tracking-widest text-slate-50 transition-all transform hover:scale-[1.01] active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
          isLoading ? 'bg-slate-500' : 'bg-red-700 border-2 border-black'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-4">
            <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando...
          </span>
        ) : (
          'Estruturar Trabalho Científico'
        )}
      </button>
    </form>
  );
};

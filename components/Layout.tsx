
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <header className="mb-12 text-center w-full max-w-4xl">
        <h1 className="comic-font text-6xl md:text-8xl italic tracking-tighter text-black uppercase transform -rotate-1 drop-shadow-md">
          Infinite <span className="text-blue-700">Academia</span>
        </h1>
        <div className="h-2 w-full bg-black mt-4 rounded-full"></div>
        <p className="mt-4 font-bold text-slate-500 uppercase tracking-[0.2em] text-sm">
          Plataforma de Estruturação Científica
        </p>
      </header>
      <main className="w-full max-w-4xl relative z-10">
        {children}
      </main>
      <footer className="mt-16 text-center text-xs font-black border-t-2 border-slate-200 pt-8 w-full max-w-4xl text-slate-400">
        <p className="uppercase mb-2 tracking-widest">© 2024 Infinite Academia | IA Generativa para Pesquisa</p>
        <p className="font-medium italic">As referências e conteúdos gerados são sugestivos e devem ser validados pelo pesquisador.</p>
      </footer>
    </div>
  );
};


import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AcademicForm } from './components/AcademicForm';
import { ArticleDisplay } from './components/ArticleDisplay';
import { PaperRequest, GeneratedPaper } from './types';
import { generateAcademicStructure } from './geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedPaper | null>(null);

  const handleFormSubmit = async (request: PaperRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateAcademicStructure(request);
      setGeneratedPaper(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Ocorreu uma falha na conexão com o orientador virtual. Verifique sua rede e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedPaper(null);
    setError(null);
  };

  return (
    <Layout>
      {error && (
        <div className="mb-8 bg-red-700 border-4 border-black p-6 text-slate-50 font-black uppercase animate-pulse shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <span className="text-4xl">⚠</span>
            {error}
          </div>
        </div>
      )}

      {!generatedPaper ? (
        <AcademicForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <ArticleDisplay paper={generatedPaper} onReset={handleReset} />
      )}

      {isLoading && !generatedPaper && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-50 p-6">
          <div className="bg-white neo-brutalism-static p-10 text-center max-w-lg w-full relative">
            <div className="absolute -top-6 -right-6 bg-red-700 text-slate-50 p-4 font-black transform rotate-12 neo-brutalism-static border-2 border-black shadow-lg">
              LOADING...
            </div>
            <div className="w-20 h-20 border-[10px] border-blue-700 border-t-black rounded-full animate-spin mx-auto mb-8"></div>
            <h3 className="comic-font text-4xl uppercase text-black mb-4 tracking-tighter">Sistematizando...</h3>
            <div className="space-y-2">
               <p className="font-black text-blue-800 uppercase text-xs tracking-[0.2em]">Varrendo bases de dados acadêmicas</p>
               <p className="font-bold text-slate-600 text-sm italic">"A ciência é o grande antídoto contra o veneno do entusiasmo e da superstição."</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;


import React, { useState } from 'react';
import { GeneratedPaper } from '../types';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import FileSaver from 'file-saver';

interface ArticleDisplayProps {
  paper: GeneratedPaper;
  onReset: () => void;
}

export const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ paper, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const splitTitle = doc.splitTextToSize(paper.title.toUpperCase(), 170);
      doc.text(splitTitle, margin, y);
      y += (splitTitle.length * 10) + 5;

      // Type
      doc.setFontSize(12);
      doc.setFont("helvetica", "italic");
      doc.text(paper.type, margin, y);
      y += 15;

      // Abstract
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("RESUMO", margin, y);
      y += 7;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const splitAbstract = doc.splitTextToSize(paper.abstract, 170);
      doc.text(splitAbstract, margin, y);
      y += (splitAbstract.length * 6) + 15;

      // Sections
      paper.sections.forEach((section, index) => {
        if (y > 250) { doc.addPage(); y = 20; }
        
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${section.title.toUpperCase()}`, margin, y);
        y += 8;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        const splitContent = doc.splitTextToSize(section.content, 170);
        doc.text(splitContent, margin, y);
        y += (splitContent.length * 6) + 10;
      });

      // References
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("REFERÊNCIAS", margin, y);
      y += 10;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      paper.references.forEach(ref => {
        const splitRef = doc.splitTextToSize(ref, 170);
        doc.text(splitRef, margin, y);
        y += (splitRef.length * 5) + 3;
      });

      doc.save(`${paper.title.substring(0, 30)}.pdf`);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToDocx = async () => {
    setIsExporting(true);
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: paper.title.toUpperCase(),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: paper.type, italic: true })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "RESUMO",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: paper.abstract,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            ...paper.sections.flatMap((section, index) => [
              new Paragraph({
                text: `${index + 1}. ${section.title}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Paragraph({
                text: section.content,
                alignment: AlignmentType.JUSTIFIED,
              })
            ]),
            new Paragraph({
              text: "REFERÊNCIAS",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 600, after: 200 },
            }),
            ...paper.references.map(ref => 
              new Paragraph({
                text: ref,
                spacing: { after: 120 },
              })
            ),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      // Resilience check for file-saver import
      const saveFn = typeof FileSaver === 'function' ? FileSaver : (FileSaver as any).saveAs;
      if (saveFn) {
        saveFn(blob, `${paper.title.substring(0, 30)}.docx`);
      } else {
        throw new Error('Função de salvamento não encontrada');
      }
    } catch (err) {
      console.error('Erro ao exportar DOCX:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-end">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-red-700 text-slate-50 font-black uppercase tracking-widest neo-brutalism hover:bg-red-800 disabled:opacity-50 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          {isExporting ? 'Processando...' : 'Baixar PDF'}
        </button>
        <button
          onClick={exportToDocx}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-slate-50 font-black uppercase tracking-widest neo-brutalism hover:bg-blue-800 disabled:opacity-50 transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          {isExporting ? 'Processando...' : 'Baixar DOCX'}
        </button>
      </div>

      <div className="bg-white neo-brutalism-static p-6 md:p-12 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 transform rotate-45 translate-x-16 -translate-y-16 border-l-4 border-b-4 border-black"></div>

        <header className="mb-10 border-b-4 border-black pb-8">
          <p className="text-blue-800 font-black uppercase tracking-[0.2em] text-xs mb-3 flex items-center gap-2">
            <span className="w-8 h-1 bg-blue-800 block"></span>
            {paper.type}
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight italic text-slate-900">
            {paper.title}
          </h1>
        </header>

        <section className="mb-12">
          <h3 className="text-lg font-black uppercase bg-black text-white px-6 py-2 inline-block mb-6 transform -skew-x-6 shadow-md">
            Resumo Científico
          </h3>
          <p className="text-xl leading-relaxed font-medium text-slate-700 italic border-l-4 border-slate-200 pl-6">
            {paper.abstract}
          </p>
        </section>

        <div className="space-y-16">
          {paper.sections.map((section, idx) => (
            <section key={idx} className="group">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-blue-800 text-slate-50 w-12 h-12 flex items-center justify-center font-black text-xl rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {idx + 1}
                </span>
                <h4 className="text-2xl font-black uppercase text-slate-900 group-hover:text-blue-800 transition-colors">
                  {section.title}
                </h4>
              </div>
              
              <div className="bg-slate-50 p-6 border-2 border-slate-200 mb-6 shadow-inner">
                <p className="text-lg text-slate-700 font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.suggestions.map((suggestion, sIdx) => (
                  <div key={sIdx} className="bg-white p-4 border-2 border-black hover:bg-yellow-50 transition-colors flex items-start gap-3">
                    <span className="text-blue-700 font-black">▶</span>
                    <span className="font-bold text-sm text-slate-800">{suggestion}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 border-t-4 border-black pt-12">
          <h3 className="text-2xl font-black uppercase mb-8 flex items-center gap-4 text-red-700">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.937 7.937 0 012 10c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8a7.935 7.935 0 01-7-5.196"></path></svg>
            Fundamentação Teórica (Sugestões ABNT)
          </h3>
          <ul className="space-y-6">
            {paper.references.map((ref, idx) => (
              <li key={idx} className="pl-6 border-l-4 border-red-600 font-bold text-slate-600 hover:text-black transition-colors">
                {ref}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-col items-center border-t-2 border-slate-100 pt-10">
          <button
            onClick={onReset}
            className="w-full md:w-auto px-12 py-5 bg-black text-slate-50 font-black uppercase tracking-[0.3em] neo-brutalism hover:bg-slate-800 transition-all text-xl shadow-xl"
          >
            Iniciar Novo Projeto
          </button>
          <p className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">
            Infinite Academia Engine v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

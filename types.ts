
export enum PaperType {
  TCC = 'TCC (Trabalho de Conclusão de Curso)',
  ARTIGO = 'Artigo Científico',
  TESE = 'Tese de Doutorado',
  DISSERTACAO = 'Dissertação de Mestrado',
  ENSAIO = 'Ensaio Teórico',
  ESTUDO_CASO = 'Estudo de Caso'
}

export interface PaperRequest {
  title: string;
  objective: string;
  type: PaperType;
  language: string;
}

export interface PaperSection {
  title: string;
  content: string;
  suggestions: string[];
}

export interface GeneratedPaper {
  title: string;
  type: PaperType;
  abstract: string;
  sections: PaperSection[];
  references: string[];
}

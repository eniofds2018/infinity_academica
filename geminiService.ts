
import { GoogleGenAI, Type } from "@google/genai";
import { PaperRequest, PaperType } from "./types";

export const generateAcademicStructure = async (request: PaperRequest) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Atue como um orientador acadêmico sênior e pesquisador experiente. 
  Gere uma estrutura detalhada para um(a) ${request.type}.
  Título do Trabalho: ${request.title}
  Objetivo Geral: ${request.objective}
  Idioma: ${request.language}

  A resposta deve ser um objeto JSON estruturado contendo:
  - title: O título refinado academicamente.
  - type: O tipo de trabalho solicitado.
  - abstract: Um resumo inicial (em torno de 200 palavras).
  - sections: Uma lista de seções (Introdução, Referencial Teórico, Metodologia, Cronograma Sugerido, etc.). Cada seção deve ter um 'title', um 'content' descritivo do que deve ser escrito e 'suggestions' (tópicos específicos para abordar).
  - references: Uma lista de 5 referências fictícias mas plausíveis no formato ABNT relacionadas ao tema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING },
          abstract: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                suggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["title", "content", "suggestions"]
            }
          },
          references: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "type", "abstract", "sections", "references"]
      }
    }
  });

  return JSON.parse(response.text);
};

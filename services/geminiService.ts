
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeWhiteboard(imageDataBase64: string, elements: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgraded for better reasoning
      contents: {
        parts: [
          { text: `You are a Senior Strategic Consultant and System Architect. 
          Analyze this whiteboard. I've provided both the visual screenshot and the metadata of the elements.
          
          Provide a structured report in Markdown:
          1. **Executive Summary**: High-level overview of the session.
          2. **Strategic Insights**: What are the core themes and business values?
          3. **Critical Risks/Gaps**: What is missing from this architecture or plan?
          4. **Recommended Actions**: Provide 3 specific action items.
          
          Metadata for context: ${JSON.stringify(elements)}` },
          {
            inlineData: {
              mimeType: 'image/png',
              data: imageDataBase64.split(',')[1],
            },
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

export async function generateAIAssistance(prompt: string, currentElements: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a whiteboard assistant. The user wants: "${prompt}". 
      Analyze existing context: ${JSON.stringify(currentElements)}.
      
      Suggest 3-5 new elements (stickies or shapes) to add.
      Return a JSON array of objects with: label, type (sticky/rect/circle), color, and a brief 'reason' for the suggestion.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              type: { type: Type.STRING },
              color: { type: Type.STRING },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Generation Error:", error);
    return [];
  }
}

export async function generateMindmapStructure(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional JSON structure for a mindmap about "${topic}". 
      Ensure nodes are strategically linked. Use hierarchical logic.
      Format: { "label": "root", "children": [ { "label": "node", "children": [] } ] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            children: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  children: {
                    type: Type.ARRAY,
                    items: { type: Type.OBJECT, properties: { label: { type: Type.STRING } } }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Mindmap Error:", error);
    throw error;
  }
}

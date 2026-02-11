
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client using process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeConfig = async (configContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following dnsmasq configuration and provide:
      1. A brief summary of what it does.
      2. Security recommendations.
      3. Potential errors or performance bottlenecks.
      
      Configuration:
      ${configContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            security: { type: Type.ARRAY, items: { type: Type.STRING } },
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "security", "issues"]
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};

export const suggestDnsRecord = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this user request, generate a standard dnsmasq DNS record (address=/domain/ip).
      Request: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING },
            ip: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["domain", "ip", "explanation"]
        }
      }
    });
    // Directly access the .text property of GenerateContentResponse.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Suggestion failed:", error);
    return null;
  }
};

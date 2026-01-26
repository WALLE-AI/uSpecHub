import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client.
// Note: In a real production app, you might proxy this through your own backend 
// to keep the key hidden, but for this frontend demo, we use the env var directly.
// The environment variable process.env.API_KEY is assumed to be injected by the runtime.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCompletion = async (
  model: string,
  systemInstruction: string,
  userMessage: string,
  temperature: number = 0.7
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: temperature,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const generateChatResponse = async (
  model: string,
  history: ChatMessage[],
  newMessage: string,
  systemInstruction?: string,
  config?: { temperature?: number; maxOutputTokens?: number }
): Promise<string> => {
  try {
    // Convert simple ChatMessage to API Content format
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add the new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    // FIX: Add thinkingConfig when maxOutputTokens is set to avoid an empty response.
    const genAIConfig: {
      systemInstruction?: string;
      temperature?: number;
      maxOutputTokens?: number;
      thinkingConfig?: { thinkingBudget: number };
    } = {
      systemInstruction: systemInstruction,
      temperature: config?.temperature,
      maxOutputTokens: config?.maxOutputTokens,
    };

    if (config?.maxOutputTokens) {
      // Reserve half of the tokens for thinking to ensure there are enough for the final response.
      genAIConfig.thinkingConfig = { thinkingBudget: Math.floor(config.maxOutputTokens / 2) };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: genAIConfig,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    throw error;
  }
};

export const validatePromptSafety = async (text: string): Promise<boolean> => {
    // Mock safety check using a smaller model or regex for demo
    // In reality, you might use the moderations endpoint or a specific classification prompt
    return !text.toLowerCase().includes("hack");
}
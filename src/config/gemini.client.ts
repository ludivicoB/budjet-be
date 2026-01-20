import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const gemini = new GoogleGenAI({});

export const geminiService = {
  test: async () => {
    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_API_MODEL || "gemini-3-pro-preview",
      contents: "Explain AI in one sentence",
    });
    return response.text;
  },
  generateText: async (prompt: string): Promise<string> => {
    const response = await gemini.models.generateContent({
      model: process.env.GEMINI_API_MODEL || "gemini-3-pro-preview",
      contents: prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Empty AI response");
    }

    return text;
  },
};

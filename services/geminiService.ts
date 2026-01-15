
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly in the constructor.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getListeningFeedback = async (title: string, summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze this student's English listening entry.
        Listening Topic: ${title}
        Student's Summary: ${summary}
        
        Please provide short, encouraging feedback in English about their comprehension. 
        Also, suggest 2-3 advanced vocabulary words related to the topic "${title}".
        Keep it brief and educational.
      `,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    // Accessing the .text property directly as per Gemini API guidelines.
    return response.text || "Could not generate feedback.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "An error occurred while getting feedback.";
  }
};

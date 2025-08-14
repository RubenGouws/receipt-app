import { GoogleGenAI, Type } from "@google/genai";
import type { ScannedExpenseData } from '../types';

// Lazily initialize the AI client to avoid a startup crash if the API key isn't set.
let ai: GoogleGenAI | null = null;

function getAiClient() {
  if (ai) {
    return ai;
  }
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This error will now be thrown during the API call, not on app load.
    throw new Error("API_KEY is not configured. Please set it in your deployment environment.");
  }
  ai = new GoogleGenAI({ apiKey });
  return ai;
}


const expenseSchema = {
    type: Type.OBJECT,
    properties: {
        merchant: { type: Type.STRING, description: "The name of the merchant or store." },
        date: { type: Type.STRING, description: "The date of the transaction in YYYY-MM-DD format." },
        totalAmount: { type: Type.NUMBER, description: "The total amount of the transaction." },
        currency: { type: Type.STRING, description: "The 3-letter currency code (e.g., USD, EUR)." },
    },
    required: ["merchant", "date", "totalAmount"],
};

export async function extractExpenseFromImage(base64Image: string): Promise<ScannedExpenseData> {
    try {
        const client = getAiClient(); // Get the client here. This is where the API key check happens.
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        text: "Analyze this receipt and extract the merchant name, date of transaction, total amount, and currency. Format the date as YYYY-MM-DD. If currency is not found, try to infer it from the context or leave it empty."
                    },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Image,
                        },
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: expenseSchema,
            },
        });

        const jsonText = response.text;
        if (!jsonText) {
            throw new Error("API returned an empty response.");
        }

        const parsedData = JSON.parse(jsonText);
        
        // Validate and shape the data
        const result: ScannedExpenseData = {};
        if (parsedData.merchant && typeof parsedData.merchant === 'string') {
            result.merchant = parsedData.merchant;
        }
        if (parsedData.date && typeof parsedData.date === 'string' && /\d{4}-\d{2}-\d{2}/.test(parsedData.date)) {
            result.date = parsedData.date;
        }
        if (parsedData.totalAmount && typeof parsedData.totalAmount === 'number') {
            result.totalAmount = parsedData.totalAmount;
        }
        if (parsedData.currency && typeof parsedData.currency === 'string') {
            result.currency = parsedData.currency.toUpperCase();
        }

        return result;

    } catch (error) {
        console.error("Error extracting expense data from image:", error);
        if (error instanceof Error) {
           // Rethrow the original error, which might be the "API_KEY not configured" message.
           throw error;
        }
        throw new Error("Failed to analyze receipt. Please try again or enter details manually.");
    }
}
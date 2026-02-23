import OpenAI from "openai";
import { WasteAnalysisResult } from "../types";

// OpenAI API kaliti - environment variable'dan olinadi
const getOpenAIKey = (): string => {
  const key = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_KEY;
  if (!key) {
    console.warn('[OpenAI] API key topilmadi. VITE_OPENAI_API_KEY environment variable sozlang.');
  }
  return key || '';
};

const createOpenAIClient = () => {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    return null;
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysisResult> => {
  const openai = createOpenAIClient();
  
  if (!openai) {
    throw new Error("OpenAI API kaliti sozlanmagan. Iltimos, administrator bilan bog'laning.");
  }

  try {
    // Base64 formatni tayyorlash
    const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;

    // OpenAI GPT-4o-mini - arzon va tez vision model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Rasmni tahlil qil va chiqindi borligini aniqla.

QOIDALAR:
1. Agar rasmda ODAM, YUZLAYUZ yoki SELFIE bo'lsa:
   - isRecyclable: false
   - material: "Inson"
   - explanation: "Siz chiqindi emassiz! Faqat chiqindilarni skanerlang."
   - ecoValue: 0

2. Agar rasmda chiqindi bo'lmasa (xona, tabiat, kompyuter va h.k.):
   - isRecyclable: false
   - explanation: "Chiqindi topilmadi."

3. Agar chiqindi bo'lsa (plastik, shisha, qog'oz, temir, elektron):
   - material: chiqindi turi
   - weightEstimateKg: taxminiy og'irlik (kg)
   - isRecyclable: true
   - Har 1 kg = 5000 UZS

Faqat JSON formatda javob ber:
{
  "material": "string",
  "weightEstimateKg": number,
  "isRecyclable": boolean,
  "confidence": number,
  "explanation": "string",
  "isAuthentic": boolean,
  "ecoValue": number
}
              `.trim()
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI javob bermadi");
    }

    const parsed = JSON.parse(content);
    
    // Qiymatni hisoblash: 1 kg = 5000 UZS
    const calculatedValue = parsed.isRecyclable 
      ? Math.ceil(parsed.weightEstimateKg * 5000) 
      : 0;
    
    return { 
      ...parsed, 
      ecoValue: calculatedValue,
      isAuthentic: parsed.isAuthentic !== false
    } as WasteAnalysisResult;

  } catch (error: any) {
    console.error("OpenAI xatosi:", error);
    
    if (error?.status === 401) {
      throw new Error("OpenAI API kaliti noto'g'ri yoki muddati tugagan");
    }
    if (error?.status === 429) {
      throw new Error("OpenAI so'rovlar limiti oshib ketdi. Keyinroq urinib ko'ring.");
    }
    
    throw new Error(error?.message || "Rasm tahlilida xatolik yuz berdi");
  }
};

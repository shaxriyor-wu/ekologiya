import OpenAI from "openai";
import { WasteAnalysisResult } from "../types";

const createGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
  });
};

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysisResult> => {
  const groq = createGroqClient();

  if (!groq) {
    throw new Error("Groq API kaliti sozlanmagan. Iltimos, administrator bilan bog'laning.");
  }

  try {
    const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
      throw new Error("Groq javob bermadi");
    }

    const parsed = JSON.parse(content);

    const calculatedValue = parsed.isRecyclable
      ? Math.ceil(parsed.weightEstimateKg * 5000)
      : 0;

    return {
      ...parsed,
      ecoValue: calculatedValue,
      isAuthentic: parsed.isAuthentic !== false
    } as WasteAnalysisResult;

  } catch (error: any) {
    console.error("Groq xatosi:", error);

    if (error?.status === 401) {
      throw new Error("Groq API kaliti noto'g'ri yoki muddati tugagan");
    }
    if (error?.status === 429) {
      throw new Error("Groq so'rovlar limiti oshib ketdi. Keyinroq urinib ko'ring.");
    }

    throw new Error(error?.message || "Rasm tahlilida xatolik yuz berdi");
  }
};

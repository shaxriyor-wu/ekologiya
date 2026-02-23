import OpenAI from "openai";
import { WasteAnalysisResult } from "../types";

const createOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
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
    const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;

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
   - ecoValue: 0

3. Agar chiqindi bo'lsa, chiqindi turiga qarab EcoCoin (EC) hisoblaydi (1 EC = 100 UZS):
   - material: chiqindi turi (o'zbek tilida)
   - weightEstimateKg: taxminiy og'irlik (kg), odatda bitta narsa uchun 0.05 - 2.0 kg
   - isRecyclable: true
   - ecoValue: EcoCoin miqdori (butun son), quyidagi narxlar bo'yicha:
     * Qog'oz, karton: 2 EC/kg (bitta varoq ≈ 0.005 kg → 0 EC, dasta qog'oz ≈ 0.5 kg → 1 EC)
     * Plastik (shisha, idish): 5 EC/kg
     * Shisha (butilka, banka): 3 EC/kg
     * Metall (temir, alyuminiy): 10 EC/kg
     * Elektron chiqindi: 20 EC/kg
     * Organik chiqindi: 1 EC/kg
     * Maishiy chiqindi (aralash): 2 EC/kg
   MUHIM: ecoValue MINIMAL 1, MAKSIMAL 50 EC bo'lsin. Bitta oddiygina narsa uchun hech qachon 10+ EC berma.

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

    // AI bergan ecoValue ni ishlatish, lekin MAX 50 EC, MIN 1 EC
    const aiEcoValue = parsed.isRecyclable ? Math.round(parsed.ecoValue || 0) : 0;
    const calculatedValue = parsed.isRecyclable
      ? Math.max(1, Math.min(50, aiEcoValue))
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

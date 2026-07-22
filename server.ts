import express, { Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// API Health route
const handleHealth = (_req: Request, res: Response) => {
  const hasKey = Boolean(
    (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY)?.trim()
  );
  res.json({
    status: "ok",
    environment: process.env.VERCEL ? "vercel" : "standalone",
    geminiKeyConfigured: hasKey, // if this is false in production, set GEMINI_API_KEY in Vercel Project Settings -> Environment Variables and redeploy
  });
};
app.get("/api/health", handleHealth);
app.get("/health", handleHealth);

// Initialize Gemini SDK with User-Agent header for telemetry
const getGeminiClient = (): GoogleGenAI => {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.API_KEY)?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required but missing");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Local robust fallback generator for reminder messages (Urdu and English)
const translateRelationshipUrdu = (rel: string): string => {
  if (!rel) return "عزیز";
  const r = rel.toLowerCase().trim();
  if (r.includes("friend")) return "دوست";
  if (r.includes("brother")) return "بھائی";
  if (r.includes("sister")) return "بہن";
  if (r.includes("sibling")) return "بہن بھائی";
  if (r.includes("cousin")) return "کزن";
  if (r.includes("coworker") || r.includes("colleague") || r.includes("work")) return "کولیگ";
  if (r.includes("family") || r.includes("relative")) return "رشتہ دار";
  if (r.includes("parent") || r.includes("father") || r.includes("mother")) return "والدین/عزیز";
  return rel;
};

interface FallbackParams {
  borrowerName: string;
  relationship: string;
  amount: number;
  dueDate?: string;
  lendingDate?: string;
  purpose?: string;
  tone: string;
  additionalNotes?: string;
  language: string;
}

const generateLocalFallback = (params: FallbackParams) => {
  const {
    borrowerName,
    relationship,
    amount,
    dueDate,
    lendingDate,
    purpose,
    tone,
    additionalNotes,
    language,
  } = params;

  const formattedAmount = `Rs. ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;

  const isUrdu = language === "ur";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(isUrdu ? "ur-PK" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formattedDueDate = formatDate(dueDate);
  const formattedLendingDate = formatDate(lendingDate);

  if (isUrdu) {
    const relUrdu = translateRelationshipUrdu(relationship);
    const purposeText = purpose ? ` (${purpose})` : "";
    const notesText = additionalNotes ? `\n\nاضافی نوٹ: ${additionalNotes}` : "";

    switch (tone) {
      case "polite_professional":
        return {
          reminderText: `السلام علیکم محترم ${borrowerName}،

امید ہے آپ بخیریت ہوں گے۔

میں امید کرتا ہوں کہ آپ کا وقت اچھا گزر رہا ہوگا۔ یہ ایک نہایت مودبانہ یاددہانی ہے اس رقم ${formattedAmount} کے بارے میں جو ${purpose ? `قرض برائے ${purpose}` : "قرض کے طور پر"} دی گئی تھی${formattedLendingDate ? ` (${formattedLendingDate} کو)` : ""}${formattedDueDate ? ` اور جس کی واپسی کی تاریخ ${formattedDueDate} تھی` : ""}۔

جب بھی آپ کو سہولت ہو، براہ کرم ادائیگی یا فنڈز کی منتقلی کے طریقہ کار کے بارے میں مطلع فرما دیں۔ آپ کے تعاون کا بہت شکریہ۔${notesText}

فقط،
[آپ کا نام]`,
          advice: "پیشہ ورانہ اور مودبانہ الفاظ کا استعمال گفتگو کو سنجیدہ اور محترم رکھتا ہے، جس سے لین دین کا وقار برقرار رہتا ہے۔"
        };
      case "soft_humorous":
        return {
          reminderText: `السلام علیکم ${borrowerName}! کیسے ہیں آپ؟ 😄

یار، میرا بینک اکاؤنٹ مجھے گھور رہا ہے اور کہہ رہا ہے کہ کچھ کرو! تو میں نے سوچا آپ کو اس رقم ${formattedAmount} کی یاددہانی کرا دوں جو ${purpose ? `${purpose} کے لیے` : "ہم نے طے کی تھی"}۔

کوئی پریشانی کی بات نہیں ہے، بس جلدی ملتے ہیں، چائے پیتے ہیں اور یہ حساب بھی برابر کرتے ہیں تاکہ بینک کا غصہ ٹھنڈا ہو!${notesText}

خیر اندیش،
[آپ کا نام]`,
          advice: "مذاق اور چائے کی دعوت کا تڑکا لگانے سے کسی قسم کی بدمزگی کا اندیشہ ختم ہو جاتا ہے اور یاددہانی بھی ہو جاتی ہے۔"
        };
      case "firm_direct":
        return {
          reminderText: `السلام علیکم ${borrowerName}،

امید ہے آپ خیریت سے ہوں گے۔

میں اس رقم ${formattedAmount} کے سلسلے میں رابطہ کر رہا ہوں جو ${purpose ? `قرض برائے ${purpose}` : "قرض کے طور پر"} دی گئی تھی${formattedLendingDate ? ` (${formattedLendingDate} کو)` : ""}${formattedDueDate ? ` اور جس کی واپسی کی آخری تاریخ ${formattedDueDate} تھی` : ""}۔

براہ کرم مجھے مطلع کریں کہ آپ یہ رقم کب تک واپس بھیج رہے ہیں تاکہ میں اپنے پاس بجٹ ریکارڈ درست کر لوں۔ آپ کا شکریہ۔${notesText}`,
          advice: "براہِ راست بات کرنا لیکن اخلاق کا دامن نہ چھوڑنا معاملے کی سنجیدگی کا اظہار کرتا ہے اور جلد ادائیگی میں مددگار ہوتا ہے۔"
        };
      case "super_friendly":
      default:
        return {
          reminderText: `السلام علیکم ${borrowerName} پیارے ${relUrdu}! امید ہے آپ خیریت سے ہوں گے۔ 🌸

یار، بس ایک چھوٹی سی بات کرنی تھی۔ وہ جو ${purpose ? `قرض برائے ${purpose}` : "رقم"} (${formattedAmount}) کی بات ہوئی تھی، میں اپنے ہفتہ وار بجٹ کو ترتیب دے رہا تھا تو وہ یاد آیا۔

کسی قسم کا کوئی دباؤ نہیں ہے، جب بھی آپ کو آسانی ہو اور ہاتھ کھلا ہو، بھیج دیجیے گا۔ اپنا بہت خیال رکھیں!${notesText}

بہت پیار،
[آپ کا نام]`,
          advice: "السلام علیکم سے آغاز اور دوستانہ لہجہ تعلق کو مضبوط رکھتا ہے اور سامنے والے کو بلاوجہ دباؤ محسوس نہیں ہوتا۔"
        };
    }
  } else {
    // English
    const purposeText = purpose ? ` for ${purpose}` : "";
    const notesText = additionalNotes ? `\n\nNote: ${additionalNotes}` : "";

    switch (tone) {
      case "polite_professional":
        return {
          reminderText: `Dear ${borrowerName},

I hope this message finds you well.

I am writing to send a gentle reminder regarding the amount of ${formattedAmount} lent${formattedLendingDate ? ` on ${formattedLendingDate}` : ""}${purposeText}${formattedDueDate ? `, which was due on ${formattedDueDate}` : ""}.

Please let me know if you need any details for the bank transfer or if you'd like to arrange another method. Thank you so much for your understanding and cooperation.${notesText}

Best regards,
[Your Name]`,
          advice: "Keeping the reminder professional and structured maintains a comfortable distance, preventing any social pressure while remaining clear."
        };
      case "soft_humorous":
        return {
          reminderText: `Hey ${borrowerName}! 😄

My bank account is currently giving me the silent treatment, and my virtual budget advisor suggested I check in about the ${formattedAmount} we talked about${purposeText}!

Let's grab coffee or lunch sometime soon so we can catch up properly and settle this before my budget helper starts crying. Let me know when you're free!${notesText}

Cheers,
[Your Name]`,
          advice: "Using light self-deprecating humor or blaming a 'budget advisor' takes the sting out of a money request, keeping the relationship cheerful."
        };
      case "firm_direct":
        return {
          reminderText: `Hi ${borrowerName},

I hope you are doing well.

I am following up on the ${formattedAmount} lent${purposeText}${formattedDueDate ? ` which was due on ${formattedDueDate}` : ""}.

Please let me know when you plan to send it over so I can update my records accordingly. Thank you for your prompt attention to this.${notesText}

Thanks,
[Your Name]`,
          advice: "Being clear, direct, and factual without excessive apologies or excuses conveys the importance of the repayment while staying completely polite."
        };
      case "super_friendly":
      default:
        return {
          reminderText: `Hey ${borrowerName}! Hope you're doing great. 🌸

Just wanted to check in! I'm tidy-up my personal budget this week and noticed the ${formattedAmount}${purposeText} is still open. 

There's absolutely no rush or pressure at all, just wanted to put it on your radar. Let me know if you can send it over whenever you get a moment! Hugs!${notesText}

Warmly,
[Your Name]`,
          advice: "A warm greeting combined with a casual tone reinforces that your friendship is the top priority, making the recipient feel comfortable."
        };
    }
  }
};

// API Endpoint for generating reminder messages
const handleGenerateReminder = async (req: Request, res: Response) => {
  try {
    let body = req.body || {};
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const {
      borrowerName,
      relationship,
      amount,
      dueDate,
      lendingDate,
      purpose,
      tone,
      additionalNotes,
      language,
    } = body;

    if (!borrowerName || !amount) {
      res.status(400).json({ error: "Borrower name and amount are required." });
      return;
    }

    let ai: GoogleGenAI | null = null;
    let keyError: string | null = null;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      keyError = err.message;
      console.warn("Gemini SDK not initialized (missing API key). Using fallback generator:", err.message);
    }

    // If Gemini client can't be created (no key), immediately use fallback
    if (!ai) {
      console.log("No Gemini API key found. Directly returning local high-quality template reminder.");
      const fallbackResult = generateLocalFallback({
        borrowerName,
        relationship,
        amount,
        dueDate,
        lendingDate,
        purpose,
        tone,
        additionalNotes,
        language,
      });
      // source + reason make it obvious in the network tab / logs why AI wasn't used,
      // instead of silently looking identical to a real AI response.
      res.json({ ...fallbackResult, source: "fallback", reason: keyError || "missing_api_key" });
      return;
    }

    const formattedAmount = `Rs. ${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;

    // Prompt engineering based on tone
    const toneInstructions: Record<string, string> = {
      super_friendly: "Warm, lighthearted, and casual. Emphasize that the friendship/bond is the priority. Use natural language, emojis, and keep it very low pressure.",
      polite_professional: "Polite, respectful, clear, and business-casual. Suitable for coworker, acquaintance, or a more formal family member. Professional but warm.",
      soft_humorous: "Funny, gentle, and playful. Use a lighthearted joke or a humorous spin (e.g., blaming the 'reminder system' or 'terrible memory') to dissolve any tension.",
      firm_direct: "Direct, straightforward, but completely respectful. No fluff, just the facts: the amount, due date, and a polite request for update or payment. Essential for overdue or repeatedly ignored payments.",
    };

    const selectedToneDesc = toneInstructions[tone] || toneInstructions.super_friendly;

    const isUrdu = language === "ur";
    const languageInstructions = isUrdu
      ? `
      LANGUAGE & CULTURAL REQUIREMENTS (CRITICAL):
      1. You MUST write BOTH the "reminderText" and the "advice" in natural, polite, respectful Urdu.
      2. Use proper Unicode Urdu script (e.g., "السلام علیکم"، "آپ کیسے ہیں؟").
      3. DO NOT use romanized Urdu (like "Assalam o Alaikum, paise kab doge?") and DO NOT mix English sentences.
      4. Ensure terms of address are warm and highly respectful, using "Aap" (آپ) instead of "Tum" (تم). Incorporate appropriate Pakistani cultural courtesy, greeting with "Assalam-o-Alaikum" (السلام علیکم) and wishing them well before gently mentioning the loan.
      5. The output must be completely natural and polite.
      `
      : `
      LANGUAGE REQUIREMENTS:
      - Write both the "reminderText" and "advice" in English.
      `;

    const promptText = `
      You are Wasool AI, an expert interpersonal relationship advisor and empathetic copywriter.
      Generate a polite, relationship-preserving reminder message for a debt based on these details:
      
      - Borrower's Name: ${borrowerName}
      - Relationship: ${relationship} (e.g., Friend, Sibling, Cousin, Coworker)
      - Lent Amount: ${formattedAmount}
      - Lent Date: ${lendingDate || "N/A"}
      - Due Date: ${dueDate || "N/A"}
      - Purpose/Reason for loan: ${purpose || "N/A"}
      - Tone requested: ${tone} (${selectedToneDesc})
      - Custom user notes/context: ${additionalNotes || "None"}
      
      ${languageInstructions}

      Instructions:
      1. Write a direct copy-pasteable reminder message that matches the specified tone and language requirements perfectly.
      2. It must feel highly customized, natural, and never like a robotic template.
      3. Do not sound passive-aggressive, confrontational, or preachy. The core value is preserving the relationship.
      4. Avoid standard, dry placeholders (like "[Insert Date Here]"). Replace them with real values or write naturally.
      5. Generate a short relationship advice tip (1-2 sentences max) explaining how to send this message successfully and why it works, matching the selected language of the reminder.
    `;

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash",
      "gemini-flash-latest",
    ];
    let response = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`Attempting reminder generation with model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reminderText: {
                  type: Type.STRING,
                  description: "The ready-to-copy polite reminder message tailored to the user's relationship and requested tone.",
                },
                advice: {
                  type: Type.STRING,
                  description: "A short, helpful tip (1-2 sentences) about how or when to send this reminder to keep things comfortable.",
                },
              },
              required: ["reminderText", "advice"],
            },
          },
        });
        if (response && response.text) {
          console.log(`Successfully generated reminder using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed to generate content:`, err.message || err);
        lastError = err;
      }
    }

    let parsedResult = null;
    if (response && response.text) {
      try {
        parsedResult = JSON.parse(response.text.trim());
      } catch (parseErr: any) {
        console.error("Failed to parse Gemini response as JSON:", parseErr.message);
      }
    }

    if (parsedResult && parsedResult.reminderText && parsedResult.advice) {
      res.json({ ...parsedResult, source: "ai" });
    } else {
      console.warn("Gemini generation failed or returned invalid response format. Falling back to local template generator. Last error:", lastError?.message);
      const fallbackResult = generateLocalFallback({
        borrowerName,
        relationship,
        amount,
        dueDate,
        lendingDate,
        purpose,
        tone,
        additionalNotes,
        language,
      });
      res.json({ ...fallbackResult, source: "fallback", reason: lastError?.message || "all_models_failed" });
    }
  } catch (error: any) {
    console.error("Error in reminder generation endpoint:", error);
    // Ultimate safety fallback in case anything throws an uncaught error
    try {
      let b = req.body || {};
      if (typeof b === "string") {
        try { b = JSON.parse(b); } catch (e) { b = {}; }
      }
      const fallbackResult = generateLocalFallback({
        borrowerName: b.borrowerName || "Borrower",
        relationship: b.relationship || "Friend",
        amount: b.amount || 0,
        dueDate: b.dueDate,
        lendingDate: b.lendingDate,
        purpose: b.purpose,
        tone: b.tone || "super_friendly",
        additionalNotes: b.additionalNotes,
        language: b.language || "en",
      });
      res.json(fallbackResult);
    } catch (finalErr: any) {
      res.status(500).json({
        error: "Failed to generate reminder due to an unexpected error.",
        details: finalErr?.message || String(finalErr),
      });
    }
  }
};

app.post("/api/generate-reminder", handleGenerateReminder);
app.post("/generate-reminder", handleGenerateReminder);

// NOTE: This file is intentionally API-only (no vite, no express.static, no app.listen).
// It is imported directly by api/*.ts for Vercel serverless functions, and by
// local-server.ts for local development. Keeping vite (an ESM-only package) and the
// dev/prod static-serving code out of this file avoids bundling vite into the Vercel
// function build, which previously caused a hard crash (ERR_REQUIRE_ESM-style failure)
// before any of this route code could even run.

export default app;
export { app };

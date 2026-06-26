import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create Gemini AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini AI Client successfully initialized");
  } catch (err) {
    console.error("Error initializing Gemini client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not set or holds placeholder value. Running in fallback mode.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Bio Generator
  app.post("/api/ai/generate-bio", async (req, res) => {
    const { name, age, city, gender, interests } = req.body;
    
    if (!ai) {
      // Offline fallback
      const genderTerm = gender === 'female' ? 'активная и творческая' : 'активный и целеустремленный';
      const fallbackBio = `Привет! Меня зовут ${name || 'Гость'}, мне ${age || 22} года, живу в г. ${city || 'Москва'}. Я ${genderTerm}, увлекаюсь: ${interests?.join(', ') || 'путешествиями'}. Буду рад познакомиться с интересными людьми!`;
      return res.json({ bio: fallbackBio, isFallback: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Напиши привлекательное, оригинальное и живое описание профиля для мобильного приложения знакомств на русском языке. 
        Вот данные о пользователе:
        Имя: ${name}
        Возраст: ${age}
        Город: ${city}
        Пол: ${gender === 'female' ? 'Женский' : 'Мужской'}
        Интересы: ${interests?.join(', ') || 'разные'}
        
        Сделай текст легким, дружелюбным, с легким юмором и добавь пару смайликов. Объем: 2-3 предложения. Напиши от первого лица.`,
      });

      res.json({ bio: response.text || "Привет! Ищу интересное общение.", isFallback: false });
    } catch (error) {
      console.error("Error generating bio:", error);
      res.status(500).json({ error: "Failed to generate bio" });
    }
  });

  // API Route: AI First Message Suggestion
  app.post("/api/ai/first-message", async (req, res) => {
    const { partnerName, partnerInterests, partnerBio } = req.body;

    if (!ai) {
      const fallbackSuggestions = [
        `Привет, ${partnerName}! Заметил, что мы оба любим ${partnerInterests?.[0] || 'интересные вещи'}. Как проводишь свободное время?`,
        `Привет! У тебя классный профиль. Расскажи, какое твое самое любимое увлечение из тех, что ты указал(а)?`,
        `Добрый день! Твое описание профиля очень зацепило. Буду рад пообщаться!`
      ];
      return res.json({ suggestions: fallbackSuggestions, isFallback: true });
    }

    try {
      const prompt = `Пользователь хочет написать первое сообщение (icebreaker) человеку по имени ${partnerName}.
      Вот данные о человеке, которому пишем:
      Интересы: ${partnerInterests?.join(', ') || 'нет данных'}
      О себе (био): ${partnerBio || 'нет данных'}
      
      Сгенерируй ровно 3 варианта первого сообщения на русском языке в формате массива строк JSON.
      Вариант 1: Кокетливое и романтичное (Flirty)
      Вариант 2: Остроумное и веселое (Funny)
      Вариант 3: Дружелюбное и открытое (Friendly, зацепка за интересы)
      
      Сообщения должны быть короткими, цепляющими, располагающими к ответу и не банальными.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of 3 message strings"
          }
        }
      });

      try {
        const parsed = JSON.parse(response.text || "[]");
        res.json({ suggestions: parsed, isFallback: false });
      } catch {
        res.json({ suggestions: [response.text], isFallback: false });
      }
    } catch (error) {
      console.error("Error generating first message:", error);
      res.status(500).json({ error: "Failed to generate messages" });
    }
  });

  // API Route: AI Compatibility Analysis
  app.post("/api/ai/compatibility", async (req, res) => {
    const { myName, myInterests, myBio, partnerName, partnerInterests, partnerBio } = req.body;

    if (!ai) {
      // Calculate a pseudo-random stable compatibility score based on names
      const combinedLength = (myName?.length || 0) + (partnerName?.length || 0);
      const score = 60 + (combinedLength % 36);
      const fallbackExplanation = `Вы оба интересуетесь активным образом жизни. У вас отличные шансы найти общий язык в сферах: ${myInterests?.filter((i: string) => partnerInterests?.includes(i)).join(', ') || 'общих бесед'}!`;
      return res.json({ score, explanation: fallbackExplanation, isFallback: true });
    }

    try {
      const prompt = `Сделай подробный анализ совместимости для пары в приложении знакомств LoveSpin.
      Пользователь 1:
      Имя: ${myName}
      Интересы: ${myInterests?.join(', ')}
      О себе: ${myBio}
      
      Пользователь 2:
      Имя: ${partnerName}
      Интересы: ${partnerInterests?.join(', ')}
      О себе: ${partnerBio}
      
      Верни JSON-объект с полями:
      1. score (число от 40 до 100) — процент совместимости.
      2. explanation (строка на русском языке, около 2-3 предложений) — экспертный разбор, почему они подходят друг другу, выделив общие точки соприкосновения.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["score", "explanation"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json({ ...data, isFallback: false });
    } catch (error) {
      console.error("Error analyzing compatibility:", error);
      res.status(500).json({ error: "Failed to analyze compatibility" });
    }
  });

  // API Route: AI Wingman/Advisor Chat
  app.post("/api/ai/advisor", async (req, res) => {
    const { messages, userProfile, partnerProfile } = req.body;

    if (!ai) {
      return res.json({ 
        reply: "Я твой ИИ-Помощник по знакомствам! В демо-режиме я советую тебе проявлять больше искренности, дарить виртуальные подарки и чаще крутить бутылочку 🍾! Это значительно повышает шансы на взаимность.",
        isFallback: true 
      });
    }

    try {
      const historyText = messages?.map((m: any) => `${m.role === 'user' ? 'Вы' : 'Ассистент'}: ${m.content}`).join('\n') || "";
      const prompt = `Ты — Амур ИИ, экспертный психолог по отношениям и мудрый советник в чате знакомств.
      Помоги пользователю завоевать симпатию или развить общение.
      Информация о пользователе:
      Имя: ${userProfile?.name}, Интересы: ${userProfile?.interests?.join(', ')}, О себе: ${userProfile?.bio}
      
      Информация о партнере:
      Имя: ${partnerProfile?.name}, Интересы: ${partnerProfile?.interests?.join(', ')}, О себе: ${partnerProfile?.bio}
      
      История диалога с ИИ-советником:
      ${historyText}
      
      Дай ценный, конкретный, психологически точный и легкий совет, как написать или ответить партнеру, чтобы разжечь интерес. Пиши дружелюбно, мотивирующе, на русском языке. Ответ должен быть лаконичным (до 4 предложений).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ reply: response.text || "Будь собой, проявляй интерес и задавай открытые вопросы!", isFallback: false });
    } catch (error) {
      console.error("Error getting advisor advice:", error);
      res.status(500).json({ error: "Failed to get AI advisor reply" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

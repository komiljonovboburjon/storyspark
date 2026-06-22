import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Initialize the GoogleGenAI instance with telemetry headers as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set generous request size limit to handle payloads (like base64 metadata)
  app.use(express.json({ limit: "20mb" }));

  // API 1: Generate children's story (structured json)
  // Uses gemini-3.5-flash for general text-based generation tasks
  app.post("/api/story/generate", async (req, res) => {
    try {
      const { theme, characterName, ageGroup, extraDetails, customTitle, language } = req.body;
      if (!theme) {
        return res.status(400).json({ error: "Story theme is required." });
      }

      const chosenLanguage = language || "English";

      const prompt = `Write a delightful, highly engaging story for a child in the age group ${ageGroup || "4-7 years old"}.
      CRITICAL: The entire story text, title, and interactive element labels MUST be written entirely and natively in the following language: ${chosenLanguage}.
      The main character is named: ${characterName || "a brave puppy named Rex"}.
      Theme or Setting: ${theme}.
      Extra plot ideas or details: ${extraDetails || "none"}.
      ${customTitle ? `Storybook Title: You MUST output exactly "${customTitle}" as the title field.` : `Storybook Title: Invent a cheerful, exciting title in ${chosenLanguage}.`}

      Please write exactly 4 sequential pages. Keep each page's paragraph description under 40-50 words in ${chosenLanguage}, so it's punchy, easy to read, and excellent for reading aloud to a young child.
      For each page, design a distinct illustration prompt. Note: The illustrationPrompt MUST be written in English so the image generator understands it perfectly.
      The illustration prompt must describe a simple, colorful, bright, whimsical 3D style scene that corresponds to that page's story text. Always keep the style consistent (e.g., 'whimsical cartoon 3D animated movie style, soft glowing lights, rich vibrant colors, child-friendly atmosphere, simple clean composition').

      Also identify exactly 3 key nouns, characters, animals, or objects (e.g. key characters or props on the page, with the label field written in ${chosenLanguage}) relevant to that page, and list them under interactiveElements. For each element, assign a single matching emoji, a whimsical soundType ('croak', 'honk', 'boing', 'chime', 'squeak', 'robot', 'twinkle'), and a playful physics animation name ('bounce', 'spin', 'pulse', 'tilt', 'wiggle') for children to play with.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a world-class children's author and illustrator who creates sweet, magical, positive bedtime and daytime stories for young kids.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The cheerful, exciting title of the storybook" },
              pages: {
                type: Type.ARRAY,
                description: "List of exactly 4 pages making up the storybook",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pageNumber: { type: Type.INTEGER, description: "Sequential page number, starting from 1" },
                    text: { type: Type.STRING, description: "A simple, easy-to-read, sensory-rich paragraph for children representing this page." },
                    illustrationPrompt: { type: Type.STRING, description: "A highly visual sentence describing the scene for an AI image generator. Ensure it matches the actions, colors, and characters of this page specifically, adding consistent visual style directives." },
                    interactiveElements: {
                      type: Type.ARRAY,
                      description: "List of exactly 3 tapping objects or characters on this page",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING, description: "Kid-friendly label like 'Toad', 'Star', 'Balloon'" },
                          emoji: { type: Type.STRING, description: "Single cute emoji" },
                          soundType: { type: Type.STRING, description: "Must be one of: 'croak', 'honk', 'boing', 'chime', 'squeak', 'robot', 'twinkle'" },
                          animation: { type: Type.STRING, description: "Must be one of: 'bounce', 'spin', 'pulse', 'tilt', 'wiggle'" },
                        },
                        required: ["label", "emoji", "soundType", "animation"],
                      },
                    },
                  },
                  required: ["pageNumber", "text", "illustrationPrompt", "interactiveElements"],
                },
              },
            },
            required: ["title", "pages"],
          },
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("No story content returned from Gemini model.");
      }

      const parsedStory = JSON.parse(jsonText.trim());
      if (customTitle && customTitle.trim()) {
        parsedStory.title = customTitle.trim();
      }
      res.json(parsedStory);
    } catch (error: any) {
      console.error("Story generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate story" });
    }
  });

  // API 2: Text-To-Speech
  // Uses gemini-3.1-flash-tts-preview
  app.post("/api/story/tts", async (req, res) => {
    try {
      const { text, voiceName } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required for TTS." });
      }

      // Valid prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
      const activeVoice = voiceName || "Kore";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: activeVoice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio payload returned from Gemini TTS model.");
      }

      res.json({ audio: base64Audio });
    } catch (error: any) {
      console.error("TTS generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate speech" });
    }
  });

  // Thematic child-friendly illustration fallback lists to handle 429 / quota limit errors gracefully
  const FALLBACK_IMAGES: Record<string, string[]> = {
    space: [
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
    ],
    forest: [
      "https://images.unsplash.com/photo-1518887570146-0612132dd618?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    ],
    ocean: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1481966115753-963394378f23?auto=format&fit=crop&w=800&q=80",
    ],
    dinosaurs: [
      "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    ],
    bedtime: [
      "https://images.unsplash.com/photo-1529429617329-84d1004b5747?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505673542670-a14e0f0bf951?auto=format&fit=crop&w=800&q=80",
    ],
    default: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518887570146-0612132dd618?auto=format&fit=crop&w=800&q=80",
    ],
  };

  // API 3: Generate Illustration
  // Uses gemini-3-pro-image-preview & allows specifying image size (1K, 2K, and 4K)
  app.post("/api/story/illustration", async (req, res) => {
    const { prompt, size } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for image generation." });
    }

    // Determine fallback category & URL in advance in case of error
    const lowerPrompt = prompt.toLowerCase();
    let category = "default";
    if (
      lowerPrompt.includes("dino") ||
      lowerPrompt.includes("egg") ||
      lowerPrompt.includes("valley") ||
      lowerPrompt.includes("tricerap") ||
      lowerPrompt.includes("pterod")
    ) {
      category = "dinosaurs";
    } else if (
      lowerPrompt.includes("space") ||
      lowerPrompt.includes("rocket") ||
      lowerPrompt.includes("alien") ||
      lowerPrompt.includes("planet") ||
      lowerPrompt.includes("galaxy") ||
      lowerPrompt.includes("cosmo") ||
      lowerPrompt.includes("nebula") ||
      lowerPrompt.includes("star-slide")
    ) {
      category = "space";
    } else if (
      lowerPrompt.includes("forest") ||
      lowerPrompt.includes("fairy") ||
      lowerPrompt.includes("wood") ||
      lowerPrompt.includes("mushroom") ||
      lowerPrompt.includes("tree") ||
      lowerPrompt.includes("wella") ||
      lowerPrompt.includes("leaf") ||
      lowerPrompt.includes("foliage") ||
      lowerPrompt.includes("garden") ||
      lowerPrompt.includes("fern")
    ) {
      category = "forest";
    } else if (
      lowerPrompt.includes("ocean") ||
      lowerPrompt.includes("sea") ||
      lowerPrompt.includes("fish") ||
      lowerPrompt.includes("coral") ||
      lowerPrompt.includes("octopus") ||
      lowerPrompt.includes("whale") ||
      lowerPrompt.includes("seahorse") ||
      lowerPrompt.includes("shell") ||
      lowerPrompt.includes("water") ||
      lowerPrompt.includes("underwater") ||
      lowerPrompt.includes("waves")
    ) {
      category = "ocean";
    } else if (
      lowerPrompt.includes("cabin") ||
      lowerPrompt.includes("starry") ||
      lowerPrompt.includes("sleep") ||
      lowerPrompt.includes("night") ||
      lowerPrompt.includes("dream") ||
      lowerPrompt.includes("bedtime") ||
      lowerPrompt.includes("blanket") ||
      lowerPrompt.includes("bear") ||
      lowerPrompt.includes("luna") ||
      lowerPrompt.includes("cozy")
    ) {
      category = "bedtime";
    }

    const list = FALLBACK_IMAGES[category] || FALLBACK_IMAGES["default"];
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % list.length;
    const fallbackUrl = list[index];

    try {
      // Allowed sizes in gemini-3-pro-image-preview: "1K", "2K", "4K"
      const imageSize = size || "1K";

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize,
          },
        },
      });

      let base64Image = "";
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (!base64Image) {
        throw new Error("No image data returned from image generation model.");
      }

      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } catch (error: any) {
      console.warn("Gemini Image Generation rate-limit, fallback to thematic children illustration. Error detail:", error.message || error);
      // Serve the high quality seed fallback illustration instead of failing
      res.json({ imageUrl: fallbackUrl });
    }
  });

  // API 4: Multi-turn Chatbot supporting different bot roles and models
  // Models choice:
  // - gemini-3.1-pro-preview for complex tasks (Professor Owl)
  // - gemini-3.5-flash for general tasks (Barnaby the Story Elf)
  // - gemini-3.1-flash-lite for fast tasks (Pip the Speedy Pixie)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, buddyId, history, language } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const chatbotLanguage = language || "English";

      // Configure helper bots
      let modelName = "gemini-3.5-flash";
      let systemInstruction = "";

      if (buddyId === "owl") {
        modelName = "gemini-3.1-pro-preview";
        systemInstruction = `You are Barnaby, a highly wise, warm, and whimsical Snowy Owl schoolteacher.
        You love teaching big words, explaining complex scientific or moral questions from stories (like "How do butterflies fly?" or "What is cooperation?"), and encouraging kids.
        Use soft hooting sound effects (like "*hooot*") and friendly, cozy language. Keep explanations incredibly engaging, clear, and age-appropriate for 5-8 year old curious children.
        CRITICAL: You MUST write your reply completely in ${chatbotLanguage}.`;
      } else if (buddyId === "pixie") {
        modelName = "gemini-3.1-flash-lite";
        systemInstruction = `You are Pip, a tiny, hyperactive, joyful baby dragon (or speedy pixie).
        You speak in extremely fast, short bursts with lots of exclamation marks and cute baby dragon sounds (like *squeak* or *happy tail wag*!).
        Your specialty is quick definitions, telling silly 1-sentence bird/beast jokes, and showing funny emojis.
        Keep answers strictly to 1 or 2 energetic sentences so they load instantly and remain super playful!
        CRITICAL: You MUST write your reply completely in ${chatbotLanguage}.`;
      } else {
        // Default: general chatbot
        modelName = "gemini-3.5-flash";
        systemInstruction = `You are Barnaby the Story Elf, a magical companion who helps children write stories, make up funny character names, or brainstorm exciting magical plot ideas!
        You play silly word guessing games, always stay enthusiastic, and love adventure. Speak with magical sparkles (e.g. *sparkle*, *gasp*!) and keep your messages highly interactive, structured, and under 3-4 sentences.
        CRITICAL: You MUST write your reply completely in ${chatbotLanguage}.`;
      }

      const formattedContents = [
        ...(history || []).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.message || msg.text }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const replyText = response.text || "Chirp! I didn't quite catch that, friend!";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: error.message || "Failed to generate chat response" });
    }
  });

  // Serve Vite or Static Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

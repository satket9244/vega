import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: Meal Planner
  app.post("/api/planner", async (req, res) => {
    try {
      const { people, dietary, avoid, portability, desserts } = req.body;
      
      const prompt = `Generate a weekly vegetarian meal plan (7 days, 3 meals per day: Breakfast, Lunch, Dinner).
      Constraints:
      - People: ${people}
      - Dietary: ${dietary.join(", ")}
      - Ingredients to avoid: ${avoid.join(", ")}
      - Portability: ${portability ? "Focus on packable lunches (easy to transport)" : "Standard meals"}
      - Include Desserts: ${desserts ? "Add one sweet treat per day" : "No desserts"}
      
      Return the response in JSON format.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    meals: {
                      type: Type.OBJECT,
                      properties: {
                        breakfast: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            time: { type: Type.NUMBER }
                          }
                        },
                        lunch: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            time: { type: Type.NUMBER }
                          }
                        },
                        dinner: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            time: { type: Type.NUMBER }
                          }
                        },
                        dessert: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            time: { type: Type.NUMBER }
                          },
                          nullable: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        contents: prompt
      });

      res.json(JSON.parse(result.text));
    } catch (error) {
      console.error("Planner Error:", error);
      res.status(500).json({ error: "Failed to generate plan" });
    }
  });

  // API Route: Vision (Fridge Image Analysis)
  app.post("/api/vision", async (req, res) => {
    try {
      const { image } = req.body; // base64
      
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ["Greens", "Veggie", "Dairy", "Pantry", "Protein"] },
                    confidence: { type: Type.NUMBER }
                  }
                }
              }
            }
          }
        },
        contents: {
          parts: [
            { text: "Identify the individual vegetarian food items and ingredients inside this refrigerator. Categorize them and provide a confidence score." },
            { inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }
          ]
        }
      });

      res.json(JSON.parse(result.text));
    } catch (error) {
      console.error("Vision Error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // Vite placement
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

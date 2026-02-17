import { GoogleGenAI, Type } from "@google/genai";
import { DailyPlan } from "../types";

export const analyzeItinerary = async (itinerary: DailyPlan[]): Promise<DailyPlan[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API key not found in environment variables. AI analysis skipped.");
    return itinerary;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are an expert travel guide for Japan and Korea. 
    Analyze the following travel itinerary carefully. 
    
    For each day and item:
    1. Estimate the weather for late February/Early March (e.g., "Sunny 5°C").
    2. Analyze the 'notes' and 'title'. Extract specific tags:
       - "Must Eat" -> type: "food"
       - "Must Buy" -> type: "shopping"
       - "Reservation" / "Booking" / "Code" -> type: "reservation"
       - Important alerts -> type: "alert"
    3. If there is a "reservation code" in the text, extract it clearly as a tag.

    Itinerary Data:
    ${JSON.stringify(itinerary.map(d => ({ 
      date: d.date, 
      items: d.items.map(i => ({ id: i.id, title: i.title, notes: i.notes })) 
    })))}

    Return a JSON object in this format:
    {
      "days": [
        {
          "date": "string",
          "weather": "string",
          "itemEnrichments": [
            {
              "itemId": "string",
              "tags": [
                { "label": "string", "type": "food" | "shopping" | "reservation" | "alert" | "info" }
              ]
            }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
                  date: { type: Type.STRING },
                  weather: { type: Type.STRING },
                  itemEnrichments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        itemId: { type: Type.STRING },
                        tags: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              label: { type: Type.STRING },
                              type: { type: Type.STRING, enum: ["food", "shopping", "reservation", "alert", "info"] }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    if (!result.days) return itinerary;

    // Merge AI result back into the itinerary
    const enhancedItinerary = itinerary.map(day => {
      const aiDay = result.days.find((r: any) => r.date === day.date);
      if (aiDay) {
        return {
          ...day,
          weather: aiDay.weather,
          items: day.items.map(item => {
             const enrichment = aiDay.itemEnrichments?.find((e: any) => e.itemId === item.id);
             if (enrichment) {
               return { ...item, tags: enrichment.tags };
             }
             return item;
          })
        };
      }
      return day;
    });

    return enhancedItinerary;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return itinerary;
  }
};
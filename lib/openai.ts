// lib/openai.ts
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: `${process.env.EXPO_PUBLIC_OPENAI_API_KEY}` });

export interface StyleAnalysis {
  textAnalysis: string;
  colorHarmony: { score: number; critique: string };
  fitAndSilhouette: { score: number; critique: string };
  styleCoherence: { score: number; critique: string };
  accessorizing: { score: number; critique: string };
  occasionMatch: { score: number; critique: string };
  trendAwareness: { score: number; critique: string };
  suggestions: string;
}

export async function generateStyleAnalysis(outfitImageUrl: string): Promise<StyleAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the provided image. 
If the image shows a human being wearing any clothing, rate the outfit based on the following criteria:
- Color harmony
- Fit & Silhouette
- Style coherence
- Accessorizing
- Trendiness
- Occasion match

Compute one overall style score between 0 and 100 that reflects the outfit’s quality and aesthetic.
Ensure the score is NOT ALWAYS (but sometimes) in increments of 5 and refelects as an integer EXACTLY the appropriate ranking.

IMPORTANT: Output only a valid JSON object exactly in this format (with no extra text):
{
  "textAnalysis": < 3-sentence quick analysis as a string > 
  "colorHarmony": {"score": <number>, "critique": "<string>"},
  "fitAndSilhouette": {"score": <number>, "critique": "<string>"},
  "styleCoherence": {"score": <number>, "critique": "<string>"},
  "accessorizing": {"score": <number>, "critique": "<string>"},
  "occasionMatch": {"score": <number>, "critique": "<string>"},
  "trendAwareness": {"score": <number>, "critique": "<string>"},
  "suggestions": "<3-sentence summary of suggestions on how to improve the outfit based on the defined criteria as a string>"
}

If the image does not clearly depict a person wearing clothing or if the person appears nude, output only:
"No outfit detected"`,
            },
            { type: "image_url", image_url: { url: outfitImageUrl } }
          ],
        },
      ],
      store: true,
    });

    // console.log("OpenAI response:", response);
    // Extract the content from the first choice.
    const content = response.choices[0]?.message?.content?.trim();
    // console.log("AI response text:", content);

    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    if (content.toLowerCase() === "no outfit detected") {
      return Promise.reject(new Error("No outfit detected"));
    }

    // Try parsing the content as JSON.
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (jsonError) {
      console.error("JSON Parse error. Received content:", content);
      throw new Error("JSON Parse error");
    }

    return {
      textAnalysis: parsed.textAnalysis || "No detailed analysis found.",
      colorHarmony: { score: parsed.colorHarmony.score, critique: parsed.colorHarmony.critique },
      fitAndSilhouette: { score: parsed.fitAndSilhouette.score, critique: parsed.fitAndSilhouette.critique },
      styleCoherence: { score: parsed.styleCoherence.score, critique: parsed.styleCoherence.critique },
      accessorizing: { score: parsed.accessorizing.score, critique: parsed.accessorizing.critique },
      occasionMatch: { score: parsed.occasionMatch.score, critique: parsed.occasionMatch.critique },
      trendAwareness: { score: parsed.trendAwareness.score, critique: parsed.trendAwareness.critique },
      suggestions: parsed.suggestions || "No suggestions provided.",

    };
  } catch (error) {
    console.error('Error generating style analysis:', error);
    throw error;
  }
}

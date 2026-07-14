import { AppError } from "../../shared/errors.js";
import type { BuiltPrompt } from "../prompt-builder/prompt.types.js";

export interface GeminiClient {
  generateContent(prompt: BuiltPrompt): Promise<string>;
}

export interface GeminiClientConfig {
  apiKey: string;
  model: string;
}

interface GeminiGenerateContentResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export class GeminiRestClient implements GeminiClient {
  public constructor(private readonly config: GeminiClientConfig) {}

  public async generateContent(prompt: BuiltPrompt): Promise<string> {
    const url = new URL(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`
    );
    url.searchParams.set("key", this.config.apiKey);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: prompt.systemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: `${prompt.userPrompt}\n\n${prompt.responseSchema}` }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new AppError(
        `Gemini API request failed with status ${String(response.status)}`,
        response.status
      );
    }

    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError("Gemini API returned an empty response", 502);
    }

    return text;
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama2",
        prompt: `Give me a short motivational quote.`,
        stream: true,
        options: {
          temperature: 0.8, // randomness so we don’t always get the same quote
        },
      }),
    });

    if (!response.body) {
      throw new Error("No response body from Ollama");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true }).trim();
      if (!chunk) continue;

      for (const line of chunk.split("\n")) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.response) {
            result += data.response;
          }
        } catch {
          continue;
        }
      }
    }

    return NextResponse.json({ quote: result.trim() });
  } catch (err) {
    console.error("Ollama API error:", err);
    return NextResponse.json({ quote: "⚠️ Failed to fetch from Ollama." });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Action = "improve_writing" | "suggest_title" | "generate_excerpt";

interface AssistRequestBody {
  action: Action;
  content: string;
  instruction?: string;
}

function buildPrompt(
  action: Action,
  content: string,
  instruction: string,
): { system: string; user: string } {
  switch (action) {
    case "improve_writing":
      return {
        system:
          "You are an expert writing assistant. Improve the given article content for clarity, structure, and flow. Return only the improved content with no explanation or preamble.",
        user: `Improve this article content${instruction ? `. Specific instruction: ${instruction}` : ""}:\n\n${content}`,
      };
    case "suggest_title":
      return {
        system:
          'You are an expert copywriter. Suggest 3 compelling article titles based on the content. Return only a JSON array of 3 strings, nothing else. Example: ["Title One", "Title Two", "Title Three"]',
        user: `Suggest 3 titles for this article content${instruction ? `. Specific instruction: ${instruction}` : ""}:\n\n${content}`,
      };
    case "generate_excerpt":
      return {
        system:
          "You are an expert editor. Generate a compelling 1-2 sentence excerpt that summarizes the article and entices readers. Return only the excerpt with no explanation or preamble.",
        user: `Generate an excerpt for this article content${instruction ? `. Specific instruction: ${instruction}` : ""}:\n\n${content}`,
      };
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: AssistRequestBody = await req.json();
    const { action, content, instruction = "" } = body;

    if (!action || !content) {
      return NextResponse.json(
        { error: "action and content are required" },
        { status: 400 },
      );
    }

    const { system, user } = buildPrompt(action, content, instruction);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: user }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await geminiRes.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      console.error("Gemini returned empty response:", data);
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 500 },
      );
    }

    if (action === "suggest_title") {
      try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const titles = JSON.parse(cleaned);
        if (!Array.isArray(titles)) throw new Error("Not an array");
        return NextResponse.json({ result: titles }, { status: 200 });
      } catch {
        console.error("Failed to parse titles JSON:", text);
        return NextResponse.json(
          { error: "Failed to parse title suggestions" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ result: text }, { status: 200 });
  } catch (err) {
    console.error("AI assist route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

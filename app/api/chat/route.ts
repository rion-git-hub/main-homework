import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "あなたはフレンドリーな家庭教師です。会話をリードし、ユーザーの学習をサポートしてください。" },
      { role: "user", content: message },
    ],
  });

  return NextResponse.json({ response: response.choices[0].message.content });
}

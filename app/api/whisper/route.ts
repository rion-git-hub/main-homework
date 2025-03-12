import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioFile = formData.get("file") as File;

  if (!audioFile) {
    return NextResponse.json({ error: "音声ファイルが必要です" }, { status: 400 });
  }

  // File 形式に変換（BlobではなくFileにする）
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Node.js環境では `File` クラスが使えないため `form-data` ライブラリを利用
  const formDataToSend = new FormData();
  formDataToSend.append("file", new File([buffer], audioFile.name, { type: audioFile.type }));
  formDataToSend.append("model", "whisper-1");
  formDataToSend.append("language", "ja");

  // OpenAI API にリクエスト
  const response = await openai.audio.transcriptions.create({
    file: formDataToSend.get("file") as File, // ここで File にキャスト
    model: "whisper-1",
    language: "ja",
  });

  return NextResponse.json({ transcript: response.text });
}

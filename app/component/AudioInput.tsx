"use client";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function AudioInput({ onTranscribe }: { onTranscribe: (text: string) => void }) {
  const { transcript, startRecording, stopRecording } = useSpeechToText();

  return (
    <div className="mt-4">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        🎙 長押しで録音
      </button>
      {transcript && <p className="mt-2">認識結果: {transcript}</p>}
      {transcript && (
        <button
          onClick={() => onTranscribe(transcript)}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          送信
        </button>
      )}
    </div>
  );
}

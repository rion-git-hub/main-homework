"use client";
import { useState } from "react";
import AudioInput from "./AudioInput";
import { speak } from "../api/tts";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "こんにちは！自己紹介をしましょう。" },
  ]);

  const handleUserMessage = async (userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userInput }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    speak(data.response);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="border p-4 rounded-md bg-gray-100 h-80 overflow-auto">
        {messages.map((msg, index) => (
          <p key={index} className={msg.role === "user" ? "text-blue-500" : "text-gray-700"}>
            {msg.content}
          </p>
        ))}
      </div>
      
      <AudioInput onTranscribe={handleUserMessage} />
    </div>
  );
}

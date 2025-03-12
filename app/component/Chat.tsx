"use client";
import { useState } from "react";
import { speak } from "@/app/api/tts";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "こんにちは！自己紹介をしましょう。" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    const aiMessage = { role: "assistant", content: data.response };
    setMessages((prev) => [...prev, aiMessage]);
    
    speak(data.response); // AIの返答を音声再生
    setInput("");
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
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full mt-2"
        placeholder="メッセージを入力..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
      >
        送信
      </button>
    </div>
  );
}

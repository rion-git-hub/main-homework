"use client";
import { useState } from "react";
import { speak } from "./api/tts";
import TaskList from "./component/TaskList";
import AudioInput from "./component/AudioInput";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "こんにちは！自己紹介をしましょう。" },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, text: "自分の名前を話す", completed: false },
    { id: 2, text: "好きな果物について話す", completed: false },
    { id: 3, text: "趣味について話す", completed: false },
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
    setTasks(data.tasks); // タスクの更新
    speak(data.response);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <TaskList tasks={tasks} />

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

"use client";
import { useState, useEffect } from "react";
import AudioInput from "./AudioInput";
import TaskList from "./TaskList";
import { speak } from "../api/tts";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "こんにちは！自己紹介をしましょう。" },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, text: "自分の名前を話す", completed: false },
    { id: 2, text: "好きな果物について話す", completed: false },
    { id: 3, text: "趣味について話す", completed: false },
  ]);

  const [isComplete, setIsComplete] = useState(false); // 宿題完了フラグ

  useEffect(() => {
    console.log("現在のタスク状態:", tasks);
    if (tasks.every(task => task.completed)) {
      console.log("🎉 すべてのタスクが完了しました！");
      setIsComplete(true);
      speak("宿題が完了しました！お疲れ様でした！");
    }
  }, [tasks]); // タスクの状態が変わるたびにチェック

  const handleUserMessage = async (userInput: string) => {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    try {
      console.log("送信前のタスク:", tasks);

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userInput, currentTasks: tasks || [] }), // undefined防止
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("APIエラー:", await res.text());
        return;
      }

      const data = await res.json();
      console.log("APIレスポンス:", data);

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);

      if (data.tasks) {
        setTasks((prevTasks) => {
          return prevTasks.map((task) => {
            const updatedTask = data.tasks.find((t: { text: string }) => t.text === task.text);
            return updatedTask ? { ...task, completed: updatedTask.completed } : task;
          });
        });
      }

      speak(data.response);

    } catch (error) {
      console.error("ネットワークエラー:", error);
    }
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

      {isComplete && (
        <div className="p-4 mt-4 bg-green-500 text-white text-center rounded">
          🎉 宿題完了！
        </div>
      )}

      <AudioInput onTranscribe={handleUserMessage} />
    </div>
  );
}

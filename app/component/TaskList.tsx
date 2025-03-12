import { useState } from "react";

export default function TaskList({ tasks }: { tasks: { id: number; text: string; completed: boolean }[] }) {
  return (
    <div className="p-4 border rounded-md bg-gray-100">
      {tasks.map((task) => (
        <p key={task.id} className={task.completed ? "line-through text-gray-500" : ""}>
          ✅ {task.text}
        </p>
      ))}
    </div>
  );
}

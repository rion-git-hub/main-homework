import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// タスクの初期値（毎回リセットしない）
const defaultTasks = [
  { id: 1, text: "自分の名前を話す", completed: false },
  { id: 2, text: "好きな果物について話す", completed: false },
  { id: 3, text: "趣味について話す", completed: false },
];

export async function POST(req: NextRequest) {
  try {
    const { message, currentTasks } = await req.json();
    
    console.log("受け取ったメッセージ:", message);
    console.log("受け取ったタスク:", currentTasks);

    if (!message) {
      return NextResponse.json({ error: "メッセージが空です" }, { status: 400 });
    }

    // `currentTasks` が `undefined` の場合はデフォルトのタスクを使用
    const tasks = currentTasks && Array.isArray(currentTasks) ? [...currentTasks] : [...defaultTasks];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `あなたはフレンドリーな家庭教師です。 
          ユーザーの発話が以下のタスクに当てはまるか判定してください。

          タスク:
          1. 「自分の名前を話す」 → 名前を言った場合（例: "私の名前は〇〇です", "〇〇と申します"）
          2. 「好きな果物について話す」 → 好きな果物について話した場合（例: "私はりんごが好きです"）
          3. 「趣味について話す」 → 趣味について話した場合（例: "私の趣味は映画を見ることです"）

          ユーザーが話した内容に対応するタスクがあれば、それを completedTasks に追加してください。`,
        },
        { role: "user", content: message },
      ],
      functions: [
        {
          name: "check_task_completion",
          description: "ユーザーの発話からタスクの達成状況をチェックする",
          parameters: {
            type: "object",
            properties: {
              completedTasks: { type: "array", items: { type: "string" } },
            },
          },
        },
      ],
      function_call: "auto",
    });

    if (!response || !response.choices || !response.choices[0].message) {
      console.error("APIレスポンスが無効:", response);
      return NextResponse.json({ error: "APIのレスポンスが無効です" }, { status: 500 });
    }

    const functionResponse = response.choices[0].message.function_call;
    if (functionResponse) {
      const functionArgs = JSON.parse(functionResponse.arguments);

      // 新しくチェックされたタスクのみ更新
      tasks.forEach(task => {
        if (functionArgs.completedTasks.includes(task.text)) {
          task.completed = true;
        }
      });
    }

    console.log("更新後のタスク:", tasks);

    return NextResponse.json({
      response: response.choices[0].message.content,
      tasks: tasks, // 更新されたタスクを返す
    });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

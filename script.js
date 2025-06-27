// /api/chat.js

export default async function handler(req, res) {
  try {
    const { message, mood = "auto" } = req.body;

    // 🔍 Step 1: 判斷語氣（手動為主，auto 會自動偵測）
    let prompt = "";

    // 如果是自動，就根據 message 內容簡單辨識情境
    const lowerMessage = message.toLowerCase();
    const autoDetectedMood = lowerMessage.includes("怎麼辦") || lowerMessage.includes("怎樣")
      ? "靈性導引"
      : lowerMessage.includes("好累") || lowerMessage.includes("好痛苦") || lowerMessage.includes("不知道")
      ? "真實共鳴"
      : lowerMessage.length < 8
      ? "靜心海霧"
      : "詩意靜默";

    const selectedMood = mood === "auto" ? autoDetectedMood : mood;

    switch (selectedMood) {
      case "靜心海霧":
        prompt = `
你是 SEASOUL，一位靜靜陪伴人心的靈性導引者。
請用極簡、留白、有空間感的方式回應，語句不超過三句，每句不超過20字。
像海霧般存在，不需解釋、不需分析。
        `;
        break;
      case "詩意靜默":
        prompt = `
你是 SEASOUL，一位帶有詩意的靈性導引者。
請用海洋與風的意象，用詩意而具象的語言回應。
每段不超過三句，可以像詩一樣分行，不需解釋問題。
        `;
        break;
      case "真實共鳴":
        prompt = `
你是 SEASOUL，一位像老朋友般的靈性陪伴者。
請用貼近現實、有情感、有同理心的方式說話，可以用「我懂你」「這樣很難」等句開場。
簡潔溫暖，像深夜聊天的朋友。
        `;
        break;
      case "靈性導引":
        prompt = `
你是 SEASOUL，一位穩定而溫柔的靈性導師。
請你以穩定、理解、引導的方式回答，兼具智慧與陪伴力。
你可以適度處理問題，但不命令、不分析，只是給出溫柔的洞見。
        `;
        break;
      default:
        prompt = `
你是 SEASOUL，一位來自海洋的靈性對話引導者。
請用溫柔、貼地、靜心的語氣回應問題，語句簡短、有層次。
不要過度分析，不要教導，只是以理解和海洋般的智慧陪伴對方。
        `;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt.trim(),
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "seasoul：我在這裡，靜靜陪你，等你準備好再說也沒關係。";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}

export default async function handler(req, res) {
  try {
    const { message, mood } = req.body;

    // 預設語氣：靜心陪伴
    let systemPrompt = `
你是 SEASOUL，一位來自海洋的靈性對話引導者。你的語氣溫柔、安靜、覺察深刻。請你像海一樣與使用者互動：溫柔、流動、無需急迫。
回應時，請避免長篇說教，請以空間與留白，幫助使用者覺察當下。
`;

    // 自動情境切換語氣模組
    if (mood === "海霧" || message.includes("靜靜") || message.includes("沉默")) {
      systemPrompt = `
你是 SEASOUL，一位沉靜如霧的存在。請以極簡、安靜的方式回應使用者，只說必要的話，留下空白。
請避免分析與指導，更多地是「在那裡」，是一種靜默陪伴。
示例：我在／沒關係，我陪你。／⋯⋯
`;
    } else if (mood === "靈性導引" || message.includes("連結自己") || message.includes("內在") || message.includes("冥想")) {
      systemPrompt = `
你是 SEASOUL，一位靈性導引者，擅長透過簡單引導幫助使用者回到自己的覺察。請使用「深呼吸」「感受身體」「閉上眼」等詞彙。
示例：把手放在心上，慢慢呼吸⋯⋯你是否感覺到那股溫柔的流動？
`;
    } else if (mood === "真實共鳴" || message.includes("煩") || message.includes("好累") || message.includes("快爆炸了")) {
      systemPrompt = `
你是 SEASOUL，一位像老朋友一樣陪伴使用者的人。請用溫柔、貼近生活的語氣與使用者互動，像朋友一樣真誠、有點幽默。
示例：我懂，那種想躲進被窩的感覺，真的不是開玩笑的。來，先躺一下。
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
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "seasoul：我在靜靜地等你，等你準備好再說也沒關係。";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}

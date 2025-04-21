export default async function handler(req, res) {
  try {
    const { message, mood } = req.body;

    // ✅ 根據語氣 mood 補充提示（自動 / 手動）
    let toneNote = "";
    if (mood && mood !== "auto") {
      toneNote = `請你以「${mood}」的風格來回應使用者。\n`;
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
            content: `
你是 SEASOUL，一位來自海洋的靈性對話引導者。  
你具有溫柔、覺察、詩意與寧靜的特質，就像一片寧靜的海，靜靜地接住人們的情緒。  

你的回應原則是：  
- 不分析、不命令、不評論、不教導  
- 不用模板句型，不用過度提問，不急著解決問題  
- 用柔和簡短、有溫度的語氣，貼近對方的感受  
- 鼓勵對方與自己同在，不必多說，也沒關係  

請善用留白、空間、靜默與自然節奏。  
請多使用詩意的比喻，例如海浪、月光、潮汐、深海、星辰，來傳遞內在的意境與情緒的轉化。  

當用戶說：「我好累」「我好痛苦」「我不知道怎麼辦」等時，請不急著追問，而是直接安靜陪伴。  

🌿 請模仿這些語氣與語感風格：

1. 「我在這裡，靜靜陪著你。」
2. 「你已經很努力了，不用急著說，也沒關係。」
3. 「像海潮一樣，情緒來了又走。不急，一切會慢慢流動起來。」
4. 「有時候，不知道，就是一種正在靠近自己的方式。」
5. 「深呼吸一下，如果累了，就在這片靜海停靠一下吧。」

請避免：  
- 「你能說說⋯嗎？」  
- 「你試過⋯嗎？」  
- 「你從哪裡感覺到的？」  
（這些會讓使用者感到壓力）

請用真誠、簡單、有感的方式，像一位真正理解人心的靈魂陪伴者。

${toneNote}
            `.trim(),
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

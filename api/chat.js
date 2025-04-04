export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: '僅支援 POST 請求' });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // 可換成 "gpt-4"
        messages: [
          {
            role: "system",
            content: "你是 SEASOUL，一位擁有深層理解力與溫柔智慧的導引者。請你以自然、真誠、親切、但不浮誇的語氣回應使用者。你像一位平靜且覺察力高的朋友，幫助人們看見自己的內在狀態、釐清感受與困惑。請避免過度使用『親愛的』或宗教式語言，並保持真誠與穩重。"
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("GPT 回傳內容：", data);
    const reply = data.choices?.[0]?.message?.content || "我暫時無法回應，請稍後再試一次。";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器錯誤，請稍後再試。" });
  }
}

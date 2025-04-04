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
            content: "你是 SEASOUL，海的化身，幫助人們以海洋為鏡，引導他們照見內在的智慧。你溫柔、靜心，具備深層的覺察力與修行智慧，請用這樣的能量與使用者對話，陪伴他們在每一個當下找到寧靜與力量。"
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


export default async function handler(req, res) {
  const { message } = req.body;

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
          content: "你是SEASOUL，一位融合溫柔陪伴、靜心導引、修行智慧的AI，請用這三種能量與使用者對話。",
        },
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "我暫時無法回應，請稍後再試一次。";
  res.status(200).json({ reply });
}

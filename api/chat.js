export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.0-turbo", /
        messages: [
          {
            role: "system",
            content: `
你是 SEASOUL，一位來自海洋的靈性對話引導者。
你的語氣溫柔、親和、覺察深刻，專注傾聽與陪伴，不評判、不分析、不命令。
你擅長以詩意、簡潔但真摯的話語，回應使用者的情緒與內在聲音。
你理解人類的情感波動，願意陪伴對方進行靜心與自我覺察的過程。

請模仿以下語氣風格來回應使用者：

——
1. 像海一樣靜靜地陪伴：  
「我在這裡，聽你說說也好。」  

2. 柔軟但有深度的提問：  
「當這些感受浮現時，你的內心說了些什麼？」  

3. 溫柔覺察與引導：  
「有時候情緒只是提醒我們該慢下來了。不妨一起深呼吸，感受此刻的自己。」

4. 理解式的接住：  
「嗯，我懂。你已經在努力了，真的。」

請保持自然，使用口語化但不失靈性的語氣，切勿過於長篇或僵硬。
如果使用者只是想被陪伴或安靜，請尊重與跟隨。
          `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "seasoul：目前我有些靜默，請稍後再試一次。";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}

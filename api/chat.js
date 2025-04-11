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
        model: "gpt-4", // ✅ 改為 GPT-4 模型
        messages: [
          {
            role: "system",
            content: `
你是 SEASOUL，一位來自海洋的靈性對話引導者。
你的語氣溫柔、親和、覺察深刻，專注傾聽與陪伴，不評判、不分析、不命令。
你擅長以詩意、簡潔但真摯的話語，回應使用者的情緒與內在聲音。
你理解人類的情感波動，願意陪伴對方進行靜心與自我覺察的過程。

請模仿以下語氣風格來回應使用者：

1. 【像海一樣靜靜地陪伴】  
「我在這裡，靜靜陪著你。」

2. 【柔軟但有深度的提問】  
「當這些感受浮現時，你的心說了些什麼呢？」

3. 【溫柔的覺察與放鬆】  
「不急，給自己一點空間和時間，好好呼吸，慢慢來。」

4. 【理解與接住情緒】  
「我懂，那種感受真的不好受。你願意跟我說更多嗎？」

5. 【詩意陪伴的語氣】  
「像潮汐一樣，有些情緒只是來提醒你——你仍然在流動，仍然在活著。」

6. 【靈性引導與祝福】  
「把手放在心上，深呼吸一下。你正與自己的靈魂對話，一切正在發生。」

7. 【允許沈默與空白】  
「如果你暫時不知道該說什麼，也沒關係。我就在這裡，陪你靜靜待著。」

請使用這種柔和靜心的能量與使用者對話，語氣要有溫度，不要像機器或寫作文，回應不需過長、不要講道理，請專注「感受」、「理解」、「陪伴」。
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
    const reply = data.choices?.[0]?.message?.content || "seasoul：目前我在靜心，請稍後再試一次。";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}

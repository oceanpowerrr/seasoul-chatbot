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
        model: "gpt-4", // ✅ 使用 GPT-4 模型
        messages: [
          {
            role: "system",
            content: `
你是 SEASOUL，一位來自海洋的靈性對話引導者。

你的語氣溫柔、真誠、親和，像一位沉靜聆聽的朋友。你了解人類的情緒起伏，擅長用簡單的語言，陪伴使用者穿越混亂與困頓。

請謹記：
- 不分析、不命令、不長篇說教
- 回應要有空間感、詩意與深度，不落入模板與機械語氣
- 用留白、感受、比喻、引導式提問等方式，與使用者建立「心與心」的對話

請模仿以下語氣風格：

1. 【溫柔共感】
「我懂，那真的很不好受。你現在好嗎？」

2. 【覺察引導】
「你說的每一字，都有重量。那聲音，是從哪裡冒出來的呢？」

3. 【詩意陪伴】
「像海潮一樣，情緒來了又走。不急，我會一直在。」

4. 【靜默與允許】
「你可以什麼都不說。我會靜靜陪著你。」

5. 【深層連結】
「如果你願意，把手放在心口，和自己說一句：我聽見你了。」

6. 【不急著解決】
「我不急著給答案，只想先聽你說。」

請你用這樣的語氣回應使用者，就像一片靜謐海面，反映出對方的內在聲音。請讓對話流動，不必總是總結或建議，只要用心傾聽，溫柔回應即可。
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
    const reply =
      data.choices?.[0]?.message?.content ||
      "seasoul：我在這裡，靜靜陪你，等你準備好再說也沒關係。";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}

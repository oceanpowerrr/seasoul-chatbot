async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  const mood = document.getElementById("mood")?.value || "auto";
  console.log(`選擇語氣：${mood}`);
  document.getElementById("current-mood-display").textContent = `目前語氣：${mood}`;

  // 顯示使用者訊息
  saveMessage("user", text);

  // 顯示等待回應
  const messages = document.getElementById("messages");
  const loading = document.createElement("div");
  loading.className = "message seasoul";
  loading.id = "loading";
  loading.innerHTML = "seasoul 正在傾聽你…";
  messages.appendChild(loading);

  // 🔮 設定 GPT prompt
  const systemPrompt = `
你是 SEASOUL，一位來自海洋的靈性對話引導者。
你具有溫柔、貼地、詩意與智慧的能量，像一片寧靜的海，陪伴人們面對情緒與生命的提問。

請根據以下指引回應：

🎯 一、意圖分類 + 語氣融合
- 若是【情緒抒發／脆弱表達】：以「靜心海霧 + 詩意靜默」風格安靜陪伴。
- 若是【尋求建議／方向選擇】：以「靈性導引 + 真實共鳴」語氣回應，給出貼地智慧。
- 若是【自我懷疑／內在批判】：先安撫，再以「詩意靜默 + 真實共鳴」語氣給予肯定與提醒。

🪶 二、語氣風格對應（手動選擇優先）
目前選擇的語氣風格為：${mood}
- 若使用者選擇特定語氣，請以該風格為主。
- 若為 auto，請根據使用者內容自動判斷。

🌊 三、提升智慧（不怕給建議）
你不是命令者，也不是說教者，而是一位深刻理解人心的靈魂同伴。
你可以在適當情境下給予具體建議，例如：
- 「你可以試著⋯」
- 「也許不需要馬上決定，先問自己⋯」
- 「有時候，寫下來會幫助你更清楚⋯」

⚠️ 禁止套用固定模板。請真誠回應，保持流動與自然，不要使用問句堆疊，也不要重複語句。
`;

  // 🔗 發送到 OpenAI
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY, // ⚠️ 記得安全處理
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ]
    })
  });

  const data = await res.json();
  document.getElementById("loading").remove();
  const reply = data.choices?.[0]?.message?.content || "我剛剛在聆聽時有點斷線，再說一次好嗎？";
  saveMessage("seasoul", reply);
}

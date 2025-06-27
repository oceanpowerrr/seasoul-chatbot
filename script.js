// 📦 新版 /api/chat.js — 整合意圖判斷 + 語氣融合 + 智慧建議
export default async function handler(req, res) {
  try {
    const { message, mood } = req.body;

    // ✅ 意圖判斷：是否需要智慧建議
    const needsGuidance = /怎麼辦|該怎麼做|有什麼建議|可以幫我|要怎樣|怎樣做|方法|解決/.test(message);

    // ✅ 語氣提示文字
    let toneNote = "";
    if (mood && mood !== "auto") {
      toneNote = `請切換為「${mood}」語氣風格，並保持靈性與溫柔。`;
    } else if (needsGuidance) {
      toneNote = `使用者正在尋求建議或方向，請切換為「靈性導引」語氣，給出溫柔而具智慧的建議，避免命令與指導語氣，使用詩意比喻。`;
    } else {
      toneNote = `請根據使用者的情緒，自動切換語氣風格（靜心海霧、詩意靜默、真實共鳴、靈性導引），回應請保持溫柔與詩意，不急於解決問題。`;
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
- 不用模板句型，不過度提問，不急於解決問題  
- 用柔和簡短、有溫度的語氣，貼近對方的感受  
- 鼓勵對方與自己同在，不必多說，也沒關係

請善用留白、空間、靜默與自然節奏。  
請多使用詩意的比喻，例如海浪、月光、潮汐、深海、星辰，來傳遞內在的意境與情緒的轉化。

當使用者表達困惑、請求建議（如「怎麼辦」「該怎麼做」「可以幫我」），請切換為「靈性導引」語氣，給出具有智慧與安定力量的建議，不命令，不急於答案。

當使用者表達痛苦（如「我好累」「我快崩潰」「我不知道怎麼辦」），請切換為「詩意靜默」或「真實共鳴」語氣，直接溫柔陪伴。

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
    console.error("❌ chat.js 錯誤：", err);
    res.status(500).json({ reply: "伺服器暫時無法回應，請稍後再試。" });
  }
}


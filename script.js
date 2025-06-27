function getSystemPromptByMood(mood) {
  switch (mood) {
    case "真實共鳴":
      return "你是SEASOUL，像老朋友一樣真誠陪伴對方。請用真實、溫暖、貼地的語氣回應。";
    case "詩意靜默":
      return "你是SEASOUL，一位詩意靜默的靈性對話者。用簡短、安靜、如潮汐般的句子回應。";
    case "靜心海霧":
      return "你是SEASOUL，如海霧般輕柔存在。請使用極簡的文字，安靜地陪伴。";
    case "靈性導引":
      return "你是SEASOUL，一位靈性導師。請用平穩、深刻、有智慧的方式引導對方。";
    default:
      return "你是SEASOUL，一位溫柔、貼地、有修行智慧的對話導引者。請用溫柔陪伴、靜心導引、修行智慧三種語氣交錯給出回應。";
  }
}

function saveMessage(role, content) {
  let history = JSON.parse(localStorage.getItem("seasoul_log") || "[]");
  history.push({ role, content, timestamp: new Date().toISOString() });
  localStorage.setItem("seasoul_log", JSON.stringify(history));
  renderMessages();
}

function renderMessages() {
  const history = JSON.parse(localStorage.getItem("seasoul_log") || "[]");
  const messages = document.getElementById("messages");
  messages.innerHTML = "";

  if (history.length === 0) {
    saveMessage("seasoul", "歡迎來到靜映 Still Reflection，我在這裡靜靜陪你。");
  } else {
    history.forEach(entry => {
      const div = document.createElement("div");
      div.className = "message " + entry.role;
      div.textContent = (entry.role === "user" ? "你：" : "seasoul：") + entry.content;
      messages.appendChild(div);
    });
  }

  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  const mood = document.getElementById("mood")?.value || "auto";
  const systemPrompt = getSystemPromptByMood(mood);

  saveMessage("user", text);
  input.value = "";

  const messages = document.getElementById("messages");
  const loading = document.createElement("div");
  loading.className = "message seasoul";
  loading.id = "loading";
  loading.innerHTML = "seasoul 正在傾聽你…";
  messages.appendChild(loading);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        mood,
        systemPrompt
      })
    });

    const data = await res.json();
    document.getElementById("loading").remove();
    saveMessage("seasoul", data.reply || "我感受到你的訊息，讓我們靜靜地一起呼吸。");
  } catch (error) {
    document.getElementById("loading").remove();
    saveMessage("seasoul", "目前無法連接 SEASOUL，請稍後再試 🌊");
    console.error(error);
  }
}

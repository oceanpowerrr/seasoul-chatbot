// script.js

// ✅ 顯示目前語氣於 UI
function updateMoodDisplay(mood) {
  const display = document.getElementById("current-mood-display");
  if (display) {
    display.textContent = `目前語氣：${mood}`;
  }
}

// ✅ 快速選項按鈕
const quickOptions = [
  "我最近常有無力感",
  "我想逃離現在的生活",
  "我失去了目標感",
  "我只是想靜靜聽點話",
  "我害怕自己會崩潰",
  "我渴望安靜與支持",
  "我想釋放一切但做不到",
  "我想重新找回我自己"
];

function renderQuickOptions() {
  const container = document.getElementById("quick-options");
  const selected = quickOptions.sort(() => 0.5 - Math.random()).slice(0, 4);
  container.innerHTML = "";
  selected.forEach(text => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => {
      document.getElementById("input").value = text;
      sendMessage();
    };
    container.appendChild(btn);
  });
}

function renderMessages() {
  const history = JSON.parse(localStorage.getItem("seasoul_log") || "[]");
  const messages = document.getElementById("messages");
  messages.innerHTML = "";
  history.forEach(entry => {
    const div = document.createElement("div");
    div.className = "message " + entry.role;
    div.textContent = (entry.role === "user" ? "你：" : "seasoul：") + entry.content;
    messages.appendChild(div);
  });
  messages.scrollTop = messages.scrollHeight;
}

function saveMessage(role, content) {
  let history = JSON.parse(localStorage.getItem("seasoul_log") || "[]");
  history.push({ role, content, timestamp: new Date().toISOString() });
  localStorage.setItem("seasoul_log", JSON.stringify(history));
  renderMessages();
}

// ✅ 傳送訊息並記錄對話
async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  const mood = document.getElementById("mood")?.value || "auto";
  console.log(`選擇語氣：${mood}`);
  updateMoodDisplay(mood);

  saveMessage("user", text);
  input.value = "";

  const messages = document.getElementById("messages");
  const loading = document.createElement("div");
  loading.className = "message seasoul";
  loading.id = "loading";
  loading.innerHTML = "seasoul 正在傾聽你…";
  messages.appendChild(loading);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, mood })
  });

  const data = await res.json();
  document.getElementById("loading").remove();
  saveMessage("seasoul", data.reply);
}

window.onload = () => {
  renderQuickOptions();
  renderMessages();
  const mood = document.getElementById("mood")?.value || "auto";
  updateMoodDisplay(mood);
};

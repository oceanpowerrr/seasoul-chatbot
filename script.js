
async function sendMessage() {
    const input = document.getElementById('input');
    const message = input.value;
    if (!message) return;

    const chat = document.getElementById('messages');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = "你：" + message;
    chat.appendChild(userMsg);

    input.value = '';

    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = "SEASOUL 正在回應中...";
    chat.appendChild(botMsg);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENAI_API_KEY // This must be injected server-side in real use
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "你是SEASOUL，一位溫柔、貼地、有修行智慧的對話導引者。請用溫柔陪伴、靜心導引、修行智慧三種語氣交錯給出回應。" },
                       { role: "user", content: message }]
        })
    });

    const data = await response.json();
    botMsg.textContent = "SEASOUL：" + (data.choices?.[0]?.message?.content || "出現了一些問題...");
}

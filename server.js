require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'meta-llama/llama-3-8b-instruct',
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.7
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',  // Cần có
      'Content-Type': 'application/json',
    }
  }
);
    

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("🔥 Lỗi khi gọi OpenRouter:");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Message:", err.message);
    }
    res.status(500).json({ reply: "Lỗi khi gọi OpenRouter API." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});

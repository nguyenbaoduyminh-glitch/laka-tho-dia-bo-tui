export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  const { destination, vibe, days, budget } = req.body || {};

  const prompt = `
Bạn là AI planner du lịch tên LaKa.
Hãy tạo lịch trình du lịch demo bằng tiếng Việt, ngắn gọn, thực tế, dễ preview trên mobile app.

Thông tin:
- Điểm đến: ${destination}
- Vibe: ${vibe}
- Số ngày: ${days}
- Ngân sách: ${budget}

Chỉ trả về JSON hợp lệ, không markdown, không giải thích thêm.
Schema:
[
  {
    "day": 1,
    "title": "Ngày 1 - ...",
    "morning": "...",
    "afternoon": "...",
    "evening": "...",
    "estimatedCost": "..."
  }
]
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}

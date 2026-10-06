const { GoogleGenerativeAI } = require('@google/generative-ai');
const createError = require('http-errors');

exports.askGemini = async (req, res, next) => {
  try {
    // prompt shape is enforced by chatSchema in routes/index.js
    const { prompt } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // We use gemini-1.5-flash as it is the fastest and perfect for real-time chat
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Pass the exact user input to the AI
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({ success: true, text: aiResponse });
  } catch (error) {
    // Never surface the upstream provider error text to the client.
    next(createError(502, 'AI service is temporarily unavailable', { cause: error }));
  }
};

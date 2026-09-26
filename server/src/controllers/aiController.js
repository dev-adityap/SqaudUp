const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.askGemini = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    // Initialize the Gemini client using the key from your .env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // We use gemini-1.5-flash as it is the fastest and perfect for real-time chat
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    // Pass the exact user input to the AI
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    res.json({ success: true, text: aiResponse });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ success: false, message: "AI failed to respond", error: error.message });
  }
};

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or try "gemini-1.5-flash"
    const result = await model.generateContent("Say hello from Gemini 1.5!");
    const response = await result.response;
    console.log("✅ Gemini says:", response.text());
  } catch (err) {
    console.error("❌ Gemini error:", err.response?.data || err.message);
  }
}

run();
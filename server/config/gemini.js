const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGeminiClient = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured. Please add your API key to .env file.');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

const getModel = (modelName = 'gemini-2.0-flash') => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
};

module.exports = { getGeminiClient, getModel };

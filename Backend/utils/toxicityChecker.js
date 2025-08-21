const OpenAI = require("openai"); 
require('dotenv').config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Check toxicity of a given text using GPT
 * @param {string} text - The text to analyze
 * @returns {Promise<number>} - Toxicity score between 0 and 100
 */
async function checkToxicity(text) {
  if (!text) throw new Error("Text is required");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a toxicity detector. 
Given any input text, return only a JSON object:
{ "toxicityScore": number } 
where toxicityScore is an integer 0-100 (0 = harmless, 100 = very toxic).`
        },
        { role: "user", content: text }
      ],
      temperature: 0,
    });

    // Parse model response
    const result = JSON.parse(response.choices[0].message.content);
    return result.toxicityScore;
  } catch (error) {
    console.error("❌ Error checking toxicity:", error);
    return null; // fallback, avoid breaking flow
  }
}

module.exports = checkToxicity;

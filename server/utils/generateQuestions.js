const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an expert technical interviewer. Based on the resume below, generate exactly 5 interview questions tailored to the candidate's skills, experience, and background.

Return ONLY a JSON array of 5 strings (the questions). No explanation, no markdown, no extra text.

Example format:
["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip markdown code fences if Gemini adds them
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const questions = JSON.parse(cleaned);
  return questions;
};

module.exports = generateQuestions;

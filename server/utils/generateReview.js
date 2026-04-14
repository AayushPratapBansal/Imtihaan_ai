const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReview = async (resumeText, questions, answers) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const qa = questions
    .map(
      (q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(no answer provided)"}`
    )
    .join("\n\n");

  const prompt = `You are an expert interviewer reviewing a candidate's interview performance.

Given the candidate's resume and their answers to interview questions, provide a review for each answer.

Return ONLY a JSON array of objects. No explanation, no markdown, no extra text.

Each object must have:
- "question": the question asked
- "answer": the candidate's answer
- "feedback": detailed written feedback (2-3 sentences)
- "strengths": what was good about the answer
- "improvements": what could be improved
- "score": a score from 1 to 10

Resume:
${resumeText}

Interview Q&A:
${qa}

Return format:
[
  {
    "question": "...",
    "answer": "...",
    "feedback": "...",
    "strengths": "...",
    "improvements": "...",
    "score": 7
  }
]`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip markdown code fences if Gemini adds them
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const review = JSON.parse(cleaned);
  return review;
};

module.exports = generateReview;

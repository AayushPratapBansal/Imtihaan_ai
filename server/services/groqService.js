const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DUMMY_QUESTIONS = [
  {
    id: 1,
    question:
      "Explain the difference between REST and GraphQL APIs. What are the advantages of each?",
  },
  {
    id: 2,
    question:
      "What is the Event Loop in Node.js and how does it handle asynchronous operations?",
  },
  {
    id: 3,
    question:
      "Explain how JWT authentication works. What are its advantages over session-based auth?",
  },
  {
    id: 4,
    question:
      "What is the difference between SQL and NoSQL databases? When would you choose MongoDB over MySQL?",
  },
  {
    id: 5,
    question:
      "Explain the concept of closures in JavaScript with a real-world use case.",
  },
];

const DUMMY_EVALUATION = {
  score: 7,
  feedback:
    "Good answer overall. You covered the main points clearly. Try to include more specific examples next time to strengthen your response.",
  correct_answer:
    "This is a sample evaluation. The AI evaluator is temporarily unavailable. Please try again shortly.",
};

const generateQuestions = async (resumeText) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer. You MUST respond with ONLY a valid JSON array. 
No explanation, no markdown, no code fences, no extra text — just the raw JSON array and nothing else.`,
        },
        {
          role: "user",
          content: `Based on the resume below, generate exactly 5 theory-based interview questions.
Focus on the candidate's listed skills, technologies, and projects.
Only ask conceptual/theory questions — no coding questions.

Resume:
${resumeText}

Respond with ONLY this JSON format, nothing else:
[
  { "id": 1, "question": "..." },
  { "id": 2, "question": "..." },
  { "id": 3, "question": "..." },
  { "id": 4, "question": "..." },
  { "id": 5, "question": "..." }
]`,
        },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content || "";

    // Extract JSON array from response robustly
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found in response");

    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (err) {
    console.error("Groq generateQuestions error:", err.message);
    console.log("Falling back to dummy questions");
    return DUMMY_QUESTIONS;
  }
};

const evaluateAnswer = async (question, answer) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a strict but fair technical interviewer evaluating a candidate's answer.
You MUST respond with ONLY a valid JSON object.
No explanation, no markdown, no code fences, no extra text — just the raw JSON object and nothing else.`,
        },
        {
          role: "user",
          content: `Evaluate the following answer:

Question: ${question}
Candidate's Answer: ${answer}

Respond with ONLY this JSON format, nothing else:
{
  "score": <number from 0 to 10>,
  "feedback": "<2-3 sentences of constructive feedback>",
  "correct_answer": "<ideal answer in 2-3 sentences>"
}`,
        },
      ],
      temperature: 0.5,
    });

    const raw = response.choices[0]?.message?.content || "";

    // Extract JSON object from response robustly
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in response");

    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (err) {
    console.error("Groq evaluateAnswer error:", err.message);
    console.log("Falling back to dummy evaluation");
    return DUMMY_EVALUATION;
  }
};

module.exports = { generateQuestions, evaluateAnswer };

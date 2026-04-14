const pdfParse = require("pdf-parse");
const {
  generateQuestions,
  evaluateAnswer,
} = require("../services/groqService"); // changed

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    if (!resumeText || resumeText.trim().length < 50)
      return res
        .status(400)
        .json({ message: "Could not extract text from PDF" });

    const questions = await generateQuestions(resumeText);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.evaluate = async (req, res) => {
  const { question, answer } = req.body;
  try {
    if (!question || !answer)
      return res.status(400).json({ message: "Question and answer required" });

    const result = await evaluateAnswer(question, answer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

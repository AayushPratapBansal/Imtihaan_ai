const QuestionCard = ({ index, question, answer, onChange }) => {
  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 28,
      marginBottom: 20,
      transition: "border-color 0.2s",
    }}
    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Question number + text */}
      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--accent-glow)",
          border: "1px solid rgba(124,106,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 13,
          color: "var(--accent2)",
        }}>
          {index + 1}
        </div>
        <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6, paddingTop: 4 }}>
          {question}
        </p>
      </div>

      {/* Answer textarea */}
      <textarea
        className="input-field"
        rows={5}
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => onChange(index, e.target.value)}
        style={{ resize: "vertical", lineHeight: 1.7 }}
      />
    </div>
  );
};

export default QuestionCard;

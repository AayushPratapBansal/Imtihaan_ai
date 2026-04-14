import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { evaluateAnswer } from '../services/api';

const Interview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const questions = state?.questions || [];

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [done, setDone] = useState(false);

  if (!questions.length) {
    navigate('/upload');
    return null;
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await evaluateAnswer({ question: questions[current].question, answer });
      setResult(res.data);
      setScores(prev => [...prev, res.data.score]);
    } catch {
      alert('Evaluation failed, try again');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent(prev => prev + 1);
      setAnswer('');
      setResult(null);
    }
  };

  const avgScore = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : 0;

  // Final summary screen
  if (done) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={{ textAlign:'center', color:'#1a1a2e' }}>Interview Complete 🎉</h2>
          <div style={styles.scoreBox}>
            <p style={styles.scoreText}>Your Average Score</p>
            <p style={styles.bigScore}>{avgScore} / 10</p>
          </div>
          <p style={{ textAlign:'center', color:'#555', fontSize:'14px' }}>
            {avgScore >= 7 ? '✅ Great job! You have strong fundamentals.' :
             avgScore >= 5 ? '📚 Good effort! Review the feedback and practice more.' :
             '💪 Keep studying! Revisit the concepts and try again.'}
          </p>
          <button style={styles.btn} onClick={() => navigate('/upload')}>
            Try Again with New Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress */}
        <div style={styles.progress}>
          <span style={styles.progressText}>Question {current + 1} of {questions.length}</span>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div style={styles.questionBox}>
          <p style={styles.question}>{questions[current].question}</p>
        </div>

        {/* Answer input — only show if not yet evaluated */}
        {!result && (
          <>
            <textarea style={styles.textarea} rows={5}
              placeholder="Type your answer here..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <button style={styles.btn} onClick={handleSubmit} disabled={loading || !answer.trim()}>
              {loading ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </>
        )}

        {/* Result */}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.scoreRow}>
              <span style={styles.scoreLabel}>Score:</span>
              <span style={{
                ...styles.scoreBadge,
                background: result.score >= 7 ? '#d4edda' : result.score >= 5 ? '#fff3cd' : '#f8d7da',
                color: result.score >= 7 ? '#155724' : result.score >= 5 ? '#856404' : '#721c24',
              }}>
                {result.score} / 10
              </span>
            </div>
            <div style={styles.section}>
              <p style={styles.label}>Feedback:</p>
              <p style={styles.text}>{result.feedback}</p>
            </div>
            <div style={styles.section}>
              <p style={styles.label}>Ideal Answer:</p>
              <p style={styles.text}>{result.correct_answer}</p>
            </div>
            <button style={styles.btn} onClick={handleNext}>
              {current + 1 >= questions.length ? 'See Final Score' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'90vh', background:'#f0f4ff', padding:'20px' },
  card: { background:'#fff', padding:'36px', borderRadius:'12px', width:'560px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  progress: { marginBottom:'20px' },
  progressText: { fontSize:'13px', color:'#888', display:'block', marginBottom:'6px' },
  progressBar: { background:'#e0e0e0', borderRadius:'10px', height:'6px' },
  progressFill: { background:'#4f8ef7', height:'6px', borderRadius:'10px', transition:'width 0.3s' },
  questionBox: { background:'#f8f9ff', border:'1px solid #dde', borderRadius:'8px', padding:'16px', marginBottom:'20px' },
  question: { fontSize:'16px', color:'#1a1a2e', lineHeight:'1.6', margin:0 },
  textarea: { width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', resize:'vertical', boxSizing:'border-box', marginBottom:'12px' },
  btn: { width:'100%', padding:'10px', background:'#4f8ef7', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer', marginTop:'4px' },
  resultBox: { marginTop:'8px' },
  scoreRow: { display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' },
  scoreLabel: { fontWeight:'bold', fontSize:'16px' },
  scoreBadge: { padding:'4px 14px', borderRadius:'20px', fontWeight:'bold', fontSize:'18px' },
  section: { marginBottom:'14px' },
  label: { fontWeight:'bold', fontSize:'14px', color:'#333', marginBottom:'4px' },
  text: { fontSize:'14px', color:'#555', lineHeight:'1.6', margin:0 },
  scoreBox: { textAlign:'center', padding:'24px', background:'#f0f4ff', borderRadius:'12px', margin:'20px 0' },
  scoreText: { color:'#666', fontSize:'14px', margin:'0 0 8px' },
  bigScore: { fontSize:'48px', fontWeight:'bold', color:'#4f8ef7', margin:0 },
};

export default Interview;
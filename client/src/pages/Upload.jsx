import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a PDF');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await uploadResume(formData);
      // Pass questions to interview page via state
      navigate('/interview', { state: { questions: res.data.questions } });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload Your Resume</h2>
        <p style={styles.sub}>We'll generate 5 theory interview questions based on your skills</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.dropzone} onClick={() => document.getElementById('fileInput').click()}>
            {file ? <p>✅ {file.name}</p> : <p>📄 Click to select PDF (max 5MB)</p>}
          </div>
          <input id="fileInput" type="file" accept=".pdf" style={{ display:'none' }}
            onChange={e => setFile(e.target.files[0])} />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Parsing & Generating Questions...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'90vh', background:'#f0f4ff' },
  card: { background:'#fff', padding:'40px', borderRadius:'12px', width:'420px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'8px', color:'#1a1a2e' },
  sub: { textAlign:'center', color:'#666', fontSize:'14px', marginBottom:'24px' },
  dropzone: { border:'2px dashed #4f8ef7', borderRadius:'8px', padding:'30px', textAlign:'center', cursor:'pointer', marginBottom:'16px', color:'#555' },
  btn: { width:'100%', padding:'10px', background:'#4f8ef7', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer' },
  error: { color:'red', fontSize:'13px', marginBottom:'10px' },
};

export default Upload;
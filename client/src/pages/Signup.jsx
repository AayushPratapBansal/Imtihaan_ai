import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signup(form);
      loginUser(res.data.user, res.data.token);
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Full Name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Signup'}
          </button>
        </form>
        <p style={styles.foot}>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'90vh', background:'#f0f4ff' },
  card: { background:'#fff', padding:'40px', borderRadius:'12px', width:'360px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', marginBottom:'20px', color:'#1a1a2e' },
  input: { width:'100%', padding:'10px', marginBottom:'14px', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'14px' },
  btn: { width:'100%', padding:'10px', background:'#4f8ef7', color:'#fff', border:'none', borderRadius:'8px', fontSize:'16px', cursor:'pointer' },
  error: { color:'red', fontSize:'13px', marginBottom:'10px' },
  foot: { textAlign:'center', marginTop:'16px', fontSize:'14px' },
};

export default Signup;
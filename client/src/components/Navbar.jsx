import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Imtihaan AI</Link>
      <div>
        {user ? (
          <>
            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'#1a1a2e', color:'#fff' },
  brand: { color:'#4f8ef7', fontWeight:'bold', fontSize:'20px', textDecoration:'none' },
  name: { marginRight:'16px', fontSize:'14px' },
  btn: { background:'#e74c3c', color:'#fff', border:'none', padding:'6px 14px', borderRadius:'6px', cursor:'pointer' },
  link: { color:'#fff', marginLeft:'16px', textDecoration:'none' },
};

export default Navbar;
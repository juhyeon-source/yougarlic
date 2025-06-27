import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ccc',
  },
  leftNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  navLinks: {
    display: 'flex',
    gap: '25px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#d3b1f2',
    textDecoration: 'none',
  },
  searchBar: {
    width: '400px',
    padding: '5px 10px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    backgroundColor: '#f5e6ff',
  },
  loginBtn: {
    textDecoration: 'none',
    color: '#999',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
};

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('user_id');
    if (userId) {
      setIsLoggedIn(true);

      // ✅ 닉네임 받아오기
      fetch('http://localhost:8000/api/profile', {
        method: 'GET',
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error('닉네임 불러오기 실패');
          return res.json();
        })
        .then((data) => setNickname(data.nickname))
        .catch((err) => {
          console.error(err);
          setNickname('');
        });
    }
  }, []);

  const handleLogout = () => {
    // FastAPI 로그아웃 API 호출
    fetch('http://localhost:8000/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        Cookies.remove('user_id');  // 쿠키 클라이언트에서도 제거
        setIsLoggedIn(false);
        setNickname('');
        navigate('/');
      })
      .catch((err) => {
        console.error("로그아웃 실패:", err);
      });
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftNav}>
        <Link to="/" style={styles.logo}>너마늘</Link>
        <div style={styles.navLinks}>
          <Link to="/create" style={styles.navLink}>Create</Link>
          <Link to="/board" style={styles.navLink}>Board</Link>
          <Link to="/mypage" style={styles.navLink}>MyPage</Link>
        </div>
      </div>
      <div style={styles.rightNav}>
        <input type="text" placeholder="+ Search" style={styles.searchBar} />
        {isLoggedIn && (
          <span style={styles.nickname}>
            {nickname} 님
          </span>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              ...styles.loginBtn,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            로그아웃
          </button>
        ) : (
          <Link to="/login" style={styles.loginBtn}>로그인</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

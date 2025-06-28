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
    cursor: 'pointer', // 클릭 가능하다는 것을 알려주기 위해 커서 모양 변경
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
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 쿠키를 사용한 기존 로그인 상태 확인 로직은 그대로 유지합니다.
    const userId = Cookies.get('user_id');
    if (userId) {
      setIsLoggedIn(true);
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
    } else {
      // 쿠키가 없으면 로그아웃 상태로 명확히 설정
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:8000/logout', {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        Cookies.remove('user_id');
        setIsLoggedIn(false);
        setNickname('');
        navigate('/');
      })
      .catch((err) => {
        console.error("로그아웃 실패:", err);
      });
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!searchText.trim()) return;
      try {
        const res = await fetch(`http://localhost:8000/api/posts/get_post_id/?name=${encodeURIComponent(searchText)}`);
        if (!res.ok) {
          alert('등록되어 있지 않은 상점입니다.');
          return;
        }
        const data = await res.json();
        navigate(`/store/${data.post_id}`);
      } catch (err) {
        console.error('검색 오류:', err);
        alert('검색 중 오류가 발생했습니다.');
      }
    }
  };

  // ▼▼▼▼▼ '보호된 링크' 클릭 핸들러 추가 ▼▼▼▼▼
  const handleProtectedLinkClick = (path) => {
    // localStorage를 확인하는 대신, 이미 가지고 있는 isLoggedIn 상태를 사용합니다.
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert('로그인이 필요한 기능입니다.');
      navigate('/login');
    }
  };
  // ▲▲▲▲▲ 여기까지 추가 ▲▲▲▲▲

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftNav}>
        <Link to="/" style={styles.logo}>너마늘</Link>
        <div style={styles.navLinks}>
          {/* ▼▼▼▼▼ Create와 MyPage 링크를 onClick 이벤트로 변경 ▼▼▼▼▼ */}
          <div onClick={() => handleProtectedLinkClick('/create')} style={styles.navLink}>
            Create
          </div>
          <Link to="/board" style={styles.navLink}>Board</Link>
          <div onClick={() => handleProtectedLinkClick('/mypage')} style={styles.navLink}>
            MyPage
          </div>
          {/* ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲ */}
        </div>
      </div>
      <div style={styles.rightNav}>
        <input
          type="text"
          placeholder="+ Search"
          style={styles.searchBar}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
        />
        {isLoggedIn && <span>{nickname} 님</span>}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{ ...styles.loginBtn, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
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
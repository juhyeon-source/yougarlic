import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 훅을 import 합니다.
import Navbar from '../components/Navbar'; // 공통 네비게이션 바 컴포넌트

// 사용자 프로필 아이콘 (간단한 SVG로 대체)
const ProfileIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#E1D0F5"/>
      <path d="M12 15C15.3137 15 18 16.567 18 18.5C18 20.433 15.3137 22 12 22C8.68629 22 6 20.433 6 18.5C6 16.567 8.68629 15 12 15Z" fill="white"/>
      <circle cx="12" cy="9" r="4" fill="white"/>
    </svg>
);


const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate(); // 2. useNavigate 훅을 사용합니다.

  useEffect(() => {
    fetch("http://localhost:8000/api/profile", {
      method: "GET",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("로그인 상태가 아닙니다.");
        }
        return res.json();
      })
      .then(data => {
        // 백엔드에서 반환한 닉네임을 포함한 사용자 정보를 상태에 저장
        setUserInfo({
          nickname: data.nickname,
          username: data.name,  // 여기는 필요시 백엔드에서 더 받아야 함
          id: data.id,
          dateOfBirth: data.birthday,
          phone: data.phone_number
        });
      })
      .catch(err => {
        console.error("프로필 정보를 불러오지 못했습니다:", err);
        // 필요 시 로그인 페이지로 강제 이동:
        // window.location.href = "/login";
      });
  }, []);

  // '내 정보 수정' 버튼 클릭 시 호출될 함수
  const handleEditProfileClick = () => {
    navigate('/edit-profile'); // 3. '/edit-profile' 경로로 이동합니다.
  };

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>마이페이지</h1>

        <div style={styles.profileHeader}>
          <ProfileIcon />
          <span style={styles.profileName}>{userInfo.username}</span>
        </div>

        <div style={styles.detailsContainer}>
          <div style={styles.detailItem}>
            <span style={styles.label}>닉네임</span>
            <span>{userInfo.nickname}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>아이디</span>
            <span>{userInfo.id}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>생년월일</span>
            <span>{userInfo.dateOfBirth}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>전화번호</span>
            <span>{userInfo.phone}</span>
          </div>
        </div>

         <div style={styles.buttonContainer}>
          {/* "내 정보 수정" 버튼의 onClick 이벤트를 수정합니다. */}
          <button style={styles.button} onClick={handleEditProfileClick}>
            내 정보 수정
          </button>
          
          <button style={styles.button} onClick={() => window.location.href = "http://127.0.0.1:8000/my-posts"}>
            내 전단지 보기
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1000px', 
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'sans-serif',
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  profileHeader: {
    backgroundColor: '#F5EEFF',
    padding: '20px 30px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profileName: {
    fontSize: '26px',
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: '50px',
    padding: '0 10px',
  },
  detailItem: {
    display: 'flex',
    fontSize: '18px',
    marginBottom: '25px',
  },
  label: {
    width: '120px',
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    marginTop: '100px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 10px',
  },
  button: {
    padding: '12px 28px',
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#E9D9FF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

export default MyPage;
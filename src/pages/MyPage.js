import React from 'react';
import Navbar from '../components/Navbar'; 

const ProfileIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#E1D0F5"/>
      <path d="M12 15C15.3137 15 18 16.567 18 18.5C18 20.433 15.3137 22 12 22C8.68629 22 6 20.433 6 18.5C6 16.567 8.68629 15 12 15Z" fill="white"/>
      <circle cx="12" cy="9" r="4" fill="white"/>
    </svg>
);


const MyPage = () => {
  const userInfo = {
    nickname: '너마늘',
    username: '유갈릭',
    id: 'you_garlic',
    dateOfBirth: '2004년 01월 29일',
    phone: '010-1234-5678',
  };

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

        {/* 로그아웃 버튼이 삭제된 버튼 컨테이너 */}
        <div style={styles.buttonContainer}>
          <button style={styles.button}>내 전단지 보기</button>
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
    // 오른쪽 정렬로 수정된 부분
    justifyContent: 'flex-end', 
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
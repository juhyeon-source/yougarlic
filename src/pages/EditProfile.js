import React, { useState, useEffect } from 'react'; // useEffect 추가
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  // 1. 초기 상태를 null로 변경
  const [userInfo, setUserInfo] = useState(null); 
  const [passwords, setPasswords] = useState({
    password: '',
    passwordAgain: ''
  });

  // 2. MyPage처럼 서버에서 프로필 정보를 가져오는 로직 추가
  useEffect(() => {
    fetch("http://localhost:8000/api/profile", {
      method: "GET",
      credentials: "include"
    })
    .then(res => {
      if (!res.ok) throw new Error("사용자 정보를 불러오는데 실패했습니다.");
      return res.json();
    })
    .then(data => {
      setUserInfo({
        name: data.name,
        id: data.id,
        nickname: data.nickname,
        birthDate: data.birthday,
        phone: data.phone_number
      });
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
      navigate('/login'); // 정보를 못불러오면 로그인 페이지로 이동
    });
  }, [navigate]);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.password && passwords.password !== passwords.passwordAgain) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 요청할 데이터 구성
    const updateData = {
      nickname: userInfo.nickname
    };
    if (passwords.password) {
      updateData.password = passwords.password;
    }

    try {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('정보 수정에 실패했습니다.');

      alert('정보가 성공적으로 수정되었습니다!');
      navigate('/mypage');
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert(error.message);
    }
  };
  // 3. 데이터가 로딩되기 전에는 "로딩 중"을 표시
  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header} onClick={() => navigate('/')} role="button">
        너마늘
      </header>
      <div style={styles.container}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>내 정보 수정</h1>
          <p style={styles.subtitle}>EditProfile</p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* 이름 (수정 불가) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>이름</label>
            <input style={{...styles.input, ...styles.disabledInput}} type="text" value={userInfo.name} readOnly />
          </div>
          {/* ID (수정 불가) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>ID</label>
            <input style={{...styles.input, ...styles.disabledInput}} type="text" value={userInfo.id} readOnly />
          </div>
          {/* 닉네임 (수정 가능) */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="nickname">닉네임</label>
            <input style={styles.input} type="text" id="nickname" name="nickname" value={userInfo.nickname} onChange={handleInfoChange} />
          </div>
          {/* 새 비밀번호 */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">새 비밀번호</label>
            <input style={styles.input} type="password" id="password" name="password" value={passwords.password} onChange={handlePasswordChange} placeholder="변경할 경우에만 입력"/>
          </div>
          {/* 새 비밀번호 확인 */}
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="passwordAgain">새 비밀번호 확인</label>
            <input style={styles.input} type="password" id="passwordAgain" name="passwordAgain" value={passwords.passwordAgain} onChange={handlePasswordChange} placeholder="변경할 경우에만 입력"/>
          </div>
          <button type="submit" style={styles.submitButton}>수정하기</button>
        </form>
      </div>
    </div>
  );
};

// ... styles 객체 (이전과 동일)
const styles = {
  page: {
    backgroundColor: '#fff',
    fontFamily: 'sans-serif',
    color: '#333',
    minHeight: '100vh',
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '40px',
    color: '#C4A1FF',
    fontSize: '24px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    margin: '5px 0 0',
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box', // 패딩과 보더가 너비에 포함되도록 설정
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#888',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#E1CFFF', // 이미지의 버튼 색상
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.2s',
  }
};


export default EditProfile;
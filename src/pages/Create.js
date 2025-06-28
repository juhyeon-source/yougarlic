import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// 기존 extractSrcFromIframe 함수는 그대로 둡니다.
const extractSrcFromIframe = (html) => {
    const match = html.match(/src=["']([^"']+)["']/);
    return match ? match[1] : html;
};

function Create() {
  const navigate = useNavigate();

  // 1. form state에 새로운 필드들 추가
  const [form, setForm] = useState({
    name: '',
    introduce: '',
    location: '',
    time: '',           // 영업시간
    rest: '',           // 영업휴무일
    google_map_url: '', // 구글맵 URL
    product: '',        // 대표 상품
  });

  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // google_map_url 입력 시 src만 추출
    if (name === "google_map_url") {
      value = extractSrcFromIframe(value);
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 🔹 1. Firestore에 상점 정보 저장
    const storeRes = await fetch("http://localhost:8000/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ 쿠키 포함!
      body: JSON.stringify(form),
    });

    if (!storeRes.ok) throw new Error("상점 정보 저장 실패");

    // 🔹 2. AI 이미지 생성 요청
    const aiRes = await fetch("http://localhost:8000/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_name: form.name,
        slogan: form.introduce,
        main_item: form.product,
      }),
    });

    if (!aiRes.ok) throw new Error("AI 이미지 생성 실패");

    // (이미지 응답 처리는 안 해도 되고, navigate만 하면 됨)
    alert("상점 등록과 전단지 생성이 완료되었습니다!");
    navigate('/');  // 홈으로 이동

  } catch (err) {
    console.error("에러 발생:", err);
    alert("상점 등록 또는 전단지 생성 중 오류가 발생했습니다.");
  } finally {
    setIsLoading(false);
  }
};

  // 스타일 관련 코드는 변경 없음
  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f5e6ff',
    marginBottom: '25px',
    fontSize: '1rem',
  };
  const labelStyle = { marginBottom: '6px', fontWeight: '500' };
  const containerStyle = { maxWidth: '600px', margin: '80px auto', display: 'flex', flexDirection: 'column', padding: '0 20px' };

  return (
    <div>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>상점 정보 등록</h1>

        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ marginBottom: '20px' }}>
              <div className="loader"></div>
            </div>
            <p>AI 전단지 생성 중... ⏱️ {elapsedTime}초</p>
          </div>
        ) : (
          // 3. JSX에 새로운 입력 필드들 추가
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>상점 이름</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>한줄 소개(10자 이상)</label>
            <input type="text" name="introduce" value={form.introduce} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>위치</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} style={inputStyle} />

            {/* --- 추가된 필드 --- */}
            <label style={labelStyle}>영업시간</label>
            <input type="text" name="time" placeholder="예: 평일 09:00 - 18:00, 주말 휴무" value={form.time} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>휴무일</label>
            <input type="text" name="rest" placeholder="예: 매주 일요일" value={form.rest} onChange={handleChange} style={inputStyle} />
            
            <label style={labelStyle}>대표 상품</label>
            <input type="text" name="product" placeholder="예: 의성 마늘빵, 꿀사과 주스" value={form.product} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Google Map URL</label>
            <input type="text" name="google_map_url" placeholder="지도에 표시될 URL을 입력하세요" value={form.google_map_url} onChange={handleChange} style={inputStyle} />
            {/* --- 여기까지 --- */}

            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#d3b1f2', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                등록하기
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .loader { border: 8px solid #eee; border-top: 8px solid #b38ce7; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Create;

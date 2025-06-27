import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAIImageGenerate = async () => {
    try {
      // 2. AI에게 전달할 텍스트에 새로운 정보들 추가
      // (구글맵 URL은 이미지 생성과 관련이 적어 제외)
      const userText = `
        상점 이름: ${form.name}
        소개: ${form.introduce}
        위치: ${form.location}
        영업시간: ${form.time}
        휴무일: ${form.rest}
        대표 상품: ${form.product}
      `;

      const aiFormData = new FormData();
      aiFormData.append("user_text", userText);

      setIsLoading(true);

      const res = await fetch("http://localhost:8000/generate-flyer/image", {
        method: "POST",
        body: aiFormData,
      });

      if (!res.ok) throw new Error("AI 이미지 생성 실패");

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      navigate('/gallery', { state: { images: [imageUrl] } });
    } catch (err) {
      console.error("AI 생성 오류:", err);
      alert("AI 이미지 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 여기에 폼 데이터를 백엔드 데이터베이스에 저장하는 로직을 추가할 수 있습니다.
    // 예를 들어, fetch('/api/stores', { method: 'POST', body: JSON.stringify(form) });
    // 위 로직 실행 후, AI 이미지 생성을 호출합니다.
    await handleAIImageGenerate();
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

            <label style={labelStyle}>한줄 소개(30자 이상)</label>
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
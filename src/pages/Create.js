import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const extractSrcFromIframe = (html) => {
  const match = html.match(/src=["']([^"']+)["']/);
  return match ? match[1] : html;
};

function Create() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    introduce: '',
    location: '',
    time: '',
    rest: '',
    google_map_url: '',
    product: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "google_map_url") {
      value = extractSrcFromIframe(value);
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1️⃣ 상점 정보 저장
      const storeRes = await fetch("http://localhost:8000/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify(form),
       credentials: "include",  // ✅ 쿠키 포함!
      });


      if (!storeRes.ok) throw new Error("상점 정보 저장 실패");

      // 2️⃣ AI 전단지 생성 요청
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

      // ✅ 사용자에게 알림 후 홈으로 이동
      alert("상점 등록과 전단지 생성이 완료되었습니다!");
      navigate('/');
    } catch (err) {
      console.error("에러 발생:", err);
      alert("입력 또는 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 스타일
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
  const containerStyle = {
    maxWidth: '600px',
    margin: '80px auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px',
  };

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
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>상점 이름</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>한줄 소개(10자 이상)</label>
            <input type="text" name="introduce" value={form.introduce} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>위치</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>영업시간</label>
            <input type="text" name="time" placeholder="예: 평일 09:00 - 18:00" value={form.time} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>휴무일</label>
            <input type="text" name="rest" placeholder="예: 매주 일요일" value={form.rest} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>대표 상품</label>
            <input type="text" name="product" placeholder="예: 의성 마늘빵" value={form.product} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Google Map URL</label>
            <input type="text" name="google_map_url" placeholder="지도에 표시될 URL" value={form.google_map_url} onChange={handleChange} style={inputStyle} />

            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{
                padding: '10px 30px',
                backgroundColor: '#d3b1f2',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                등록하기
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .loader {
          border: 8px solid #eee;
          border-top: 8px solid #b38ce7;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Create;

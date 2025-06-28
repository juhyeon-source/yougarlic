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
  const [generatedImages, setGeneratedImages] = useState([]); // ✅ 생성된 전단지 이미지들
  const [postId, setPostId] = useState(null);                 // ✅ 저장된 상점 ID
  const [step, setStep] = useState('form');                   // 'form' | 'selectFlyer'
  const [selectedUrl, setSelectedUrl] = useState(null);       // ✅ 선택된 전단지 URL

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
    if (name === "google_map_url") {
      value = extractSrcFromIframe(value);
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. 상점 정보 저장
      const storeRes = await fetch("http://localhost:8000/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!storeRes.ok) throw new Error("상점 정보 저장 실패");

      const storeData = await storeRes.json();
      const newPostId = storeData.post_id;
      setPostId(newPostId); // 저장된 ID 기억

      // 2. AI 전단지 생성
      const aiRes = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_name: form.name,
          slogan: form.introduce,
          main_item: form.product,
        }),
      });

      const aiData = await aiRes.json();
      const imageUrls = aiData.image_urls;
      setGeneratedImages(imageUrls);
      setStep("selectFlyer");  // ✅ 전단지 선택 단계로 전환

    } catch (err) {
      console.error("에러 발생:", err);
      alert("상점 등록 또는 전단지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlyerSelect = async (url) => {
  try {
    // 1. 서버에 선택한 전단지 URL 저장
    const res = await fetch("http://localhost:8000/api/save-flyer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        post_id: postId,
        flyer_url: url,
      }),
    });

    if (!res.ok) throw new Error("전단지 저장 실패");

    // 2. 저장 성공 시 해당 상점 상세 페이지로 이동
    navigate(`/store/${postId}`);
  } catch (err) {
    console.error("전단지 저장 실패:", err);
    alert("전단지 저장에 실패했습니다.");
  }
};



   const inputStyle = {
    width: '100%', padding: '10px 15px', borderRadius: '10px',
    border: 'none', backgroundColor: '#f5e6ff', marginBottom: '25px', fontSize: '1rem',
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
            <div className="loader"></div>
            <p>AI 전단지 생성 중... ⏱️ {elapsedTime}초</p>
          </div>
        ) : step === "form" ? (
          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>상점 이름</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>한줄 소개</label>
            <input type="text" name="introduce" value={form.introduce} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>위치</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>영업시간</label>
            <input type="text" name="time" value={form.time} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>휴무일</label>
            <input type="text" name="rest" value={form.rest} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>대표 상품</label>
            <input type="text" name="product" value={form.product} onChange={handleChange} style={inputStyle} />

            <label style={labelStyle}>Google Map URL</label>
            <input type="text" name="google_map_url" value={form.google_map_url} onChange={handleChange} style={inputStyle} />

            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#d3b1f2', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                등록하기
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>전단지를 선택해주세요</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {generatedImages.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`전단지 ${index + 1}`}
                  style={{ width: '200px', cursor: 'pointer', borderRadius: '12px' }}
                  onClick={() => handleFlyerSelect(url)}
                />
              ))}
            </div>
          </div>
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


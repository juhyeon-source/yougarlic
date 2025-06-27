import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function FlyerGallery() {
  const [flyerImages, setFlyerImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [storeDesc, setStoreDesc] = useState("");

  const SERVER_URL = "http://localhost:8000";

  const generateFlyer = async () => {
    if (!storeDesc.trim()) {
        alert("상점 설명을 입력해주세요.");
        return;
    }
    try {
        const response = await fetch(`${SERVER_URL}/generate-flyer/image`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ user_text: storeDesc }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("전단지 생성 실패: " + errorData.error);
            return;
        }

        const blob = await response.blob(); // 중요
        const imageUrl = URL.createObjectURL(blob); // URL 생성
        setFlyerImages((prev) => [...prev, imageUrl]); // 이미지 배열에 추가
        setStoreDesc("");
    } catch (error) {
        console.error("전단지 생성 실패:", error);
        alert("전단지 생성 중 오류가 발생했습니다.");
    }
};

  const handleSave = async (idx) => {
    const imageUrl = flyerImages[idx];
    const imageName = `flyer_${idx + 1}.png`;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("이미지 저장 실패:", err);
      alert("이미지를 저장하는 데 실패했습니다.");
    }
  };

  const handleRegister = (idx) => {
    const imageUrl = flyerImages[idx];
    // 추후 DB 연동하여 저장 및 등록 기능 연결
    alert(`등록 기능은 추후 구현 예정입니다.\n선택된 이미지 URL:\n${imageUrl}`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h2>AI 전단지 갤러리</h2>

        {/* 상점 설명 입력 및 전단지 생성 */}
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="상점 설명을 입력하세요..."
            value={storeDesc}
            onChange={(e) => setStoreDesc(e.target.value)}
            style={{
              width: '300px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={generateFlyer}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#a88be0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            전단지 생성
          </button>
        </div>

        {/* 갤러리 영역 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px', flexWrap: 'wrap' }}>
          {flyerImages && flyerImages.length > 0 ? (
            flyerImages.map((imgUrl, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <img
                  src={imgUrl}
                  alt={`전단지 ${idx + 1}`}
                  style={{
                    width: '250px',
                    borderRadius: '12px',
                    boxShadow: selectedIndex === idx
                      ? '0 0 0 4px #a88be0'
                      : '0 4px 8px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedIndex(idx)}
                />
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="radio"
                    name="flyer"
                    checked={selectedIndex === idx}
                    onChange={() => setSelectedIndex(idx)}
                  />{" "}
                  선택
                </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleSave(idx)}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#e5ccfc',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    저장하기
                  </button>
                  <button
                    onClick={() => handleRegister(idx)}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#e5ccfc',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    등록하기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ marginTop: '40px' }}>생성된 전단지가 없습니다. 상점 설명을 입력 후 전단지를 생성해보세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlyerGallery;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// 1. 버튼 관련 스타일이 제거된 styles 객체
const styles = {
  home: {
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    gap: '60px',
  },
  mapContainer: {
    width: '400px',
    height: '300px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  posterContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '15px',
  },
  arrowButton: {
    fontSize: '24px',
    cursor: 'pointer',
    userSelect: 'none',
    background: 'none',
    border: 'none',
  },
  posterImage: {
    width: '250px',
    height: 'auto',
    borderRadius: '12px',
  },
};

const posterImages = [
  '/images/poster1.jpg',
  '/images/poster2.jpg',
  '/images/poster3.jpg',
];

const center = {
  lat: 36.3555,
  lng: 128.6975,
};

function Home() {
  const [posterIndex, setPosterIndex] = useState(0);
  const navigate = useNavigate();

  // 2. handleCreateClick 함수 삭제됨

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY, // 이 부분과 .env 파일의 변수 이름을 꼭 확인하세요!
  });

  const handlePrev = () => {
    setPosterIndex((prevIndex) => (prevIndex - 1 + posterImages.length) % posterImages.length);
  };

  const handleNext = () => {
    setPosterIndex((prevIndex) => (prevIndex + 1) % posterImages.length);
  };

  const handleMapClick = () => {
    window.open('https://www.google.com/maps/place/경상북도+의성군', '_blank');
  };

  return (
    <div style={styles.home}>
      <Navbar />

      <div style={styles.mainContent}>
        {/* 3. 상점 등록하기 버튼 JSX 삭제됨 */}

        {isLoaded ? (
          <div style={styles.mapContainer} onClick={handleMapClick}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={13}
              options={{
                disableDefaultUI: true,
                clickableIcons: false,
              }}
            />
          </div>
        ) : (
          <div>Loading map...</div>
        )}

        <div style={styles.posterContainer}>
          <button style={styles.arrowButton} onClick={handlePrev}>◀</button>
          <img src={posterImages[posterIndex]} alt={`포스터 ${posterIndex + 1}`} style={styles.posterImage} />
          <button style={styles.arrowButton} onClick={handleNext}>▶</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
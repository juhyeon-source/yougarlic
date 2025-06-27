import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // ✅ 공통 네비게이션 컴포넌트 import

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
  mapImage: {
    width: '40%',
    maxWidth: '400px',
    height: 'auto',
    borderRadius: '12px',
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

function Home() {
  const [posterIndex, setPosterIndex] = useState(0);

  const handlePrev = () => {
    setPosterIndex((prevIndex) => (prevIndex - 1 + posterImages.length) % posterImages.length);
  };

  const handleNext = () => {
    setPosterIndex((prevIndex) => (prevIndex + 1) % posterImages.length);
  };

  return (
    <div style={styles.home}>
      <Navbar /> {/* ✅ 네비게이션 컴포넌트 */}

      <div style={styles.mainContent}>
        <img src="/images/map.png" alt="지역 지도" style={styles.mapImage} />

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

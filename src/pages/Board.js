import React from 'react';
import Navbar from '../components/Navbar'; // ◀◀ 1. 이 줄을 추가하세요.

// 나중에 서버에서 받아올 실제 데이터라고 가정하는 샘플 데이터입니다.
const storeData = [
  // ... (데이터는 이전과 동일)
  {
    id: 1,
    name: '우리집 당근이지',
    rating: 4.0,
    description: '눈에 좋은 거야 당근이지',
  },
  {
    id: 2,
    name: '여긴채소',
    rating: 4.0,
    description: '몸에 좋은 채소 존맛탱보다는 더 싸요',
  },
  {
    id: 3,
    name: '메가음료',
    rating: 4.0,
    description: '음료 많이 드시방께',
  },
  {
    id: 4,
    name: '싱싱농장',
    rating: 4.5,
    description: '오늘 막 수확한 싱싱한 채소들!',
  },
  {
    id: 5,
    name: '의성마늘닭',
    rating: 4.8,
    description: '의성 마늘을 듬뿍 넣은 건강 통닭',
  },
  {
    id: 6,
    name: '달콤과일가게',
    rating: 4.2,
    description: '제철 맞은 신선한 과일이 한가득',
  },
];

const Board = () => {
  return (
    // 전체를 감싸는 div 태그
    <div>
      <Navbar /> {/* ◀◀ 2. 이 줄을 추가하세요. */}

      <div style={styles.container}>
        <h2 style={styles.title}>의성군 상점 리스트</h2>

        <div style={styles.listContainer}>
          {storeData.map((store) => (
            <div key={store.id} style={styles.card}>
              <div style={styles.imagePlaceholder}></div>
              <div style={styles.cardContent}>
                <h3 style={styles.storeName}>{store.name}</h3>
                <p style={styles.rating}>⭐ ({store.rating.toFixed(1)})</p>
                <p style={styles.description}>{store.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- 스타일 코드는 변경할 필요 없습니다. ---
const styles = {
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
      fontFamily: 'sans-serif',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '30px',
    },
    listContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '30px',
    },
    card: {
      display: 'flex',
      alignItems: 'center', // 세로 중앙 정렬 추가
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    imagePlaceholder: {
      width: '80px', // 크기 약간 조정
      height: '80px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      flexShrink: 0,
    },
    cardContent: {
      marginLeft: '20px',
    },
    storeName: {
      margin: '0 0 8px 0',
      fontSize: '18px',
    },
    rating: {
      margin: '0 0 12px 0',
      fontSize: '14px',
      color: '#666',
    },
    description: {
      margin: '0',
      fontSize: '14px',
      color: '#888',
    },
  };

export default Board;
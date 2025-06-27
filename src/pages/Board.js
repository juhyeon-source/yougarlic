import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 


const Board = () => {
  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')  // FastAPI 서버 주소
      .then((res) => res.json())
      .then((data) => setStoreData(data))
      .catch((err) => console.error("데이터 가져오기 오류:", err));
  }, []);

  return (
    <div>
      <Navbar /> 
      <div style={styles.container}>
        <h2 style={styles.title}>의성군 상점 리스트</h2>
        <div style={styles.listContainer}>
          {storeData.map((store) => (
            <div key={store.id} style={styles.card}>
              <div style={styles.imagePlaceholder}></div>
              <div style={styles.cardContent}>
                <h3 style={styles.storeName}>{store.name}</h3>
                <p style={styles.description}>{store.introduce}</p>
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
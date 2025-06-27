// src/pages/StoreDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StoreDetail = () => {
  const { storeId } = useParams(); 
  const [storeData, setStoreData] = useState(null);
  const [customUrl, setCustomUrl] = useState(''); // ◀◀ 1. 새로 입력할 URL을 위한 state 추가

  useEffect(() => {
    fetch(`http://localhost:8000/api/posts/${storeId}`)
      .then(res => res.json())
      .then(data => setStoreData(data))
      .catch(err => console.error("가게 정보 불러오기 실패:", err));
  }, [storeId]);

  if (!storeData) {
    return <div>가게 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.pageContainer}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>의성군 상점</h1>
          <div style={styles.mapContainer}>
            {storeData.google_map_url ? (
              <iframe 
                src={storeData.google_map_url}
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy" title="store-map"
              ></iframe>
            ) : (
              <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                지도 정보가 없습니다.
              </div>
            )}
          </div>
          <div style={styles.flyerContainer}>
            <span>생성된 전단지가 여기에 표시됩니다.</span>
          </div>
        </div>

        <div style={styles.rightColumn}>
            {/* ... 기존 상세 정보 표시는 변경 없음 ... */}
            <div style={styles.detailItem}><p style={styles.label}>상점 이름</p><div style={styles.valueBox}>{storeData.name}</div></div>
            <div style={styles.detailItem}><p style={styles.label}>한줄 소개</p><div style={styles.valueBox}>{storeData.introduce}</div></div>
            <div style={styles.detailItem}><p style={styles.label}>위치</p><div style={styles.valueBox}>{storeData.location}</div></div>
            <div style={styles.detailItem}><p style={styles.label}>대표 상품</p><div style={styles.valueBox}>{storeData.product}</div></div>
            <div style={styles.detailItem}><p style={styles.label}>운영 시간</p><div style={styles.valueBox}>{storeData.time}</div></div>
            <div style={styles.detailItem}><p style={styles.label}>휴무일</p><div style={styles.valueBox}>{storeData.rest}</div></div>
        </div>
      </div>
    </div>
  );
};


const styles = {
  // ... 기존 스타일 ...
  pageContainer: { display: 'flex', gap: '40px', maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1, paddingTop: '60px' },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' },
  mapContainer: { width: '100%', height: '200px', backgroundColor: '#f0f0f0', borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee' },
  flyerContainer: { width: '100%', height: '500px', backgroundColor: '#F5EEFF', borderRadius: '15px', marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888', fontSize: '16px', border: '1px solid #eee' },
  detailItem: { marginBottom: '20px' },
  label: { fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#333' },
  valueBox: { backgroundColor: '#F5EEFF', padding: '15px', borderRadius: '10px', fontSize: '16px' },
};

export default StoreDetail;
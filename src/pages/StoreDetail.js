// src/pages/StoreDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const StoreDetail = () => {
  // 1. URL 파라미터에서 가게의 ID를 가져옵니다 (예: /store/1 -> storeId는 '1')
  const { storeId } = useParams(); 
  
  // 2. 특정 가게 하나의 데이터를 저장할 state
  const [storeData, setStoreData] = useState(null);

  // 3. storeId를 이용해 서버에서 해당 가게의 정보만 가져옵니다.
  useEffect(() => {
    // 실제 서버 API 주소는 백엔드에 맞게 수정해야 합니다.
    fetch(`http://localhost:8000/api/posts/${storeId}`)
      .then(res => res.json())
      .then(data => setStoreData(data))
      .catch(err => console.error("가게 정보 불러오기 실패:", err));
  }, [storeId]); // storeId가 바뀔 때마다 실행

  // 데이터 로딩 중일 때 보여줄 화면
  if (!storeData) {
    return <div>가게 정보를 불러오는 중입니다...</div>;
  }

  // 4. 받아온 데이터를 화면에 표시합니다.
  return (
    <div>
      <Navbar />
      <div style={styles.pageContainer}>
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>의성군 상점</h1>
          <div style={styles.mapContainer}>
            {/* 구글맵 URL이 있다면 iframe으로 지도를 표시할 수 있습니다. */}
            {storeData.google_map_url ? (
              <iframe 
                src={storeData.google_map_url} // DB에서 가져온 Embed용 URL
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy" title="store-map"
              ></iframe>
            ) : (
              <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                지도 정보가 없습니다.
              </div>
            )}
          </div>

          {/* ◀◀ 전단지가 들어갈 칸 추가 */}
          <div style={styles.flyerContainer}>
            <span>생성된 전단지가 여기에 표시됩니다.</span>
          </div>

        </div>

        <div style={styles.rightColumn}>
          <div style={styles.detailItem}>
            <p style={styles.label}>상점 이름</p>
            <div style={styles.valueBox}>{storeData.name}</div>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.label}>한줄 소개</p>
            <div style={styles.valueBox}>{storeData.introduce}</div>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.label}>위치</p>
            <div style={styles.valueBox}>{storeData.location}</div>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.label}>대표 상품</p>
            <div style={styles.valueBox}>{storeData.product}</div>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.label}>운영 시간</p>
            <div style={styles.valueBox}>{storeData.time}</div>
          </div>
          <div style={styles.detailItem}>
            <p style={styles.label}>휴무일</p>
            <div style={styles.valueBox}>{storeData.rest}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 스타일
const styles = {
  pageContainer: { display: 'flex', gap: '40px', maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1, paddingTop: '60px' },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' },
  
  // ◀◀ 지도 컨테이너 높이 수정 (300px -> 200px)
  mapContainer: { 
    width: '100%', 
    height: '200px', 
    backgroundColor: '#f0f0f0', 
    borderRadius: '15px', 
    overflow: 'hidden',
    border: '1px solid #eee'
  },
  
  // ◀◀ 전단지 컨테이너 스타일 추가
  flyerContainer: {
    width: '100%',
    height: '250px',
    backgroundColor: '#F5EEFF', // 연보라색 배경
    borderRadius: '15px',
    marginTop: '20px', // 지도와 간격
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#888',
    fontSize: '16px',
    border: '1px solid #eee'
  },

  detailItem: { marginBottom: '20px' },
  label: { fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#333' },
  valueBox: { backgroundColor: '#F5EEFF', padding: '15px', borderRadius: '10px', fontSize: '16px' },
};

export default StoreDetail;
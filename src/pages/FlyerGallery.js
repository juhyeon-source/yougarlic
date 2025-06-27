import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

// 이 페이지는 특정 가게의 ID를 URL 파라미터로 받아와서
// 해당 ID에 맞는 가게 데이터를 서버에서 불러와 화면에 표시하는 역할을 합니다.

const StoreDetail = () => {
  // URL의 파라미터(예: /store/:storeId)에서 가게 ID를 가져옵니다.
  const { storeId } = useParams(); 
  
  // 가게 데이터를 저장할 state. 실제로는 서버에서 받아옵니다.
  const [storeData, setStoreData] = useState(null);

  // 컴포넌트가 처음 렌더링될 때 서버에 데이터를 요청하는 부분을 시뮬레이션합니다.
  useEffect(() => {
    // TODO: 실제로는 아래와 같이 서버에서 데이터를 가져와야 합니다.
    // fetch(`http://127.0.0.1:8000/stores/${storeId}`)
    //   .then(res => res.json())
    //   .then(data => setStoreData(data));

    // 지금은 예시 데이터를 사용하여 화면을 구성합니다.
    const mockData = {
      id: storeId,
      name: '아호',
      introduce: '안녕하세요 아호입니다',
      location: '의성군 너마늘 위한 마늘빵빌라 상가 1층 건물',
      product: '마늘치킨',
      google_map_url: 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=의성마늘한우프라자', // 실제로는 Embed용 URL이 필요합니다.
      time: '09~10',
      rest: '매주 화요일',
    };
    setStoreData(mockData);

  }, [storeId]); // storeId가 바뀔 때마다 데이터를 다시 불러옵니다.


  // 로딩 중일 때 표시할 화면
  if (!storeData) {
    return <div>가게 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.pageContainer}>
        {/* 왼쪽 컬럼: 지도와 광고 이미지 */}
        <div style={styles.leftColumn}>
          <h1 style={styles.title}>의성군 상점</h1>
          {/* 구글 지도 표시 영역 */}
          <div style={styles.mapContainer}>
             {/* 실제 지도 연동 시 아래 iframe을 사용하거나, 
               @react-google-maps/api 같은 라이브러리를 사용할 수 있습니다.
               storeData.google_map_url에 유효한 Google Maps Embed URL이 있어야 합니다.
             */}
            <iframe 
              src={storeData.google_map_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
          {/* 광고 이미지 */}
          <div style={styles.adImageContainer}>
            {/* 이 부분은 원하는 이미지로 교체할 수 있습니다. */}
            <img src="https://via.placeholder.com/400x250.png?text=Ad+Banner" alt="Advertisement" style={{ width: '100%', borderRadius: '15px' }} />
          </div>
        </div>

        {/* 오른쪽 컬럼: 상세 정보 */}
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
            <p style={styles.label}>Google Map URL</p>
            <div style={styles.valueBox}>
                {/* 링크는 a 태그를 사용해 클릭 가능하게 만듭니다. */}
                <a href={storeData.google_map_url.replace('/embed', '/search')} target="_blank" rel="noopener noreferrer">
                    Google 지도로 보기
                </a>
            </div>
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


// 스타일 정의
const styles = {
  pageContainer: {
    display: 'flex',
    gap: '40px',
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'sans-serif',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    paddingTop: '60px', // 제목과 높이를 맞추기 위한 여백
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  mapContainer: {
    width: '100%',
    height: '300px',
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    overflow: 'hidden', // borderRadius를 iframe에 적용하기 위함
    marginBottom: '20px',
  },
  adImageContainer: {
    width: '100%',
  },
  detailItem: {
    marginBottom: '20px',
  },
  label: {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '8px',
    color: '#333',
  },
  valueBox: {
    backgroundColor: '#F5EEFF',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '16px',
  },
};

export default StoreDetail;
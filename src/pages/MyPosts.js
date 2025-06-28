import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // 공통 네비게이션 바
import './MyPosts.css'; // 이 페이지를 위한 전용 스타일

const MyPosts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 생성된 전단지 시안 목록 (지금은 비어있음)
    const [flyers, setFlyers] = useState([]);
    const [selectedFlyer, setSelectedFlyer] = useState(null);

    useEffect(() => {
        // 1. '상점 정보 등록'에서 생성 직후 넘어온 경우
        if (location.state && location.state.generatedFlyers) {
            console.log("상점 등록 후 생성된 전단지 정보를 표시합니다.");
            setFlyers(location.state.generatedFlyers);
        } 
        // 2. '마이페이지'에서 그냥 '내 전단지 보기'를 눌러 넘어온 경우
        else {
            console.log("저장된 내 전단지 목록을 불러옵니다. (현재는 임시 데이터 사용)");
            // TODO: 추후에는 여기서 서버 API를 호출하여
            // 사용자가 저장한 전단지 목록을 가져와야 합니다.
            const mockData = [
                { id: 'flyer1' },
                { id: 'flyer2' }
            ];
            setFlyers(mockData);
        }
    }, [location]);

    const handleSelectFlyer = (flyer) => {
        setSelectedFlyer(flyer);
    };

    return (
        <div>
            <Navbar />
            <div className="myposts-main-container">
                <h1 className="myposts-title">내 전단지 보기</h1>
                <div className="flyer-selection-container">
                    {flyers.map((flyer, index) => (
                        <div key={index} className="flyer-item-box">
                            {/* AI 연동 전이므로, 이미지는 비워두고 공간만 차지합니다. */}
                            <div className="flyer-image-placeholder"></div>
                            <div className="flyer-radio-button">
                                <input
                                    type="radio"
                                    id={`flyer-radio-${index}`}
                                    name="flyer-selection"
                                    onChange={() => handleSelectFlyer(flyer)}
                                    checked={selectedFlyer?.id === flyer.id}
                                />
                                <label htmlFor={`flyer-radio-${index}`}>선택</label>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="myposts-button-group">
                    <button className="myposts-button" onClick={() => navigate('/create')}>다시 제작</button>
                    <button className="myposts-button">저장하기</button>
                    <button className="myposts-button">등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default MyPosts;

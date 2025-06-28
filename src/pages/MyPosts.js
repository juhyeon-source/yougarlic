import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './MyPosts.css';

const MyPosts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [flyers, setFlyers] = useState([]);
    const [selectedFlyer, setSelectedFlyer] = useState(null);
    const [storeId, setStoreId] = useState(null);  // ✅ 상점 ID 추적용

    useEffect(() => {
        const fetchFlyers = async () => {
            const res = await fetch("http://localhost:8000/api/posts", {
            credentials: "include"
            });
            const data = await res.json();
            const myFlyers = data
            .filter(post => post.flyer_image_url)
            .map(post => ({
                id: post.id,
                url: post.flyer_image_url
            }));
            setFlyers(myFlyers);
        };

        if (location.state?.generatedFlyers) {
            setFlyers(location.state.generatedFlyers);
        } else {
            fetchFlyers();
        }
        }, [location]);

    const handleSelectFlyer = (flyer) => {
        setSelectedFlyer(flyer);
    };

    const handleSaveFlyer = async () => {
        if (!selectedFlyer || !storeId) {
            alert("전단지를 선택하거나 상점 ID가 없습니다.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/save-flyer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    post_id: storeId,
                    flyer_url: selectedFlyer.url
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("전단지가 저장되었습니다!");
            } else {
                alert("저장 실패: " + data.error);
            }
        } catch (err) {
            console.error("저장 중 오류:", err);
            alert("저장 중 오류 발생");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="myposts-main-container">
                <h1 className="myposts-title">내 전단지 보기</h1>
                <div className="flyer-selection-container">
                    {flyers.map((flyer, index) => (
                        <div key={index} className="flyer-item-box">
                            <img
                                src={flyer.url}
                                alt={`전단지 ${index + 1}`}
                                className="flyer-image"
                                style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                            />
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
                    <button className="myposts-button" onClick={handleSaveFlyer}>저장하기</button>
                    <button className="myposts-button">등록하기</button>
                </div>
            </div>
        </div>
    );
};

export default MyPosts;

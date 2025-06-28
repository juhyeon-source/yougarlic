import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './MyPosts.css';

const MyPosts = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [flyers, setFlyers] = useState([]);
    const [selectedFlyer, setSelectedFlyer] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);

    useEffect(() => {
        const fetchFlyers = async () => {
            const res = await fetch("http://localhost:8000/api/posts", {
                credentials: "include"
            });
            const data = await res.json();

            const myFlyers = data
                .filter(post => post.flyer_image_urls && post.flyer_image_urls.length > 0)
                .map(post => ({
                    id: post.id,
                    url: post.flyer_image_urls[0],
                    name: post.name,
                    introduce: post.introduce,
                    location: post.location,
                    product: post.product,
                    time: post.time,
                    rest: post.rest,
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
        setStoreInfo(flyer);
    };

    return (
        <div>
            <Navbar />
            <div className="myposts-main-container">
                <h1 className="myposts-title">내 전단지 보기</h1>

                <div className="flyer-selection-container">
                    {flyers.map((flyer, index) => (
                        <div key={index} className="flyer-item-box" onClick={() => handleSelectFlyer(flyer)}>
                        <img
                            src={flyer.url} // base64 or URL 모두 가능
                            alt={`전단지 ${index + 1}`}
                            className="flyer-image"
                            style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                        />
                        </div>
                    ))}
                </div>


                {storeInfo && (
                    <div className="flyer-detail-container">
                        <div className="flyer-detail-left">
                            <img
                                src={storeInfo.url}
                                alt="선택된 전단지"
                                className="selected-flyer-image"
                            />
                        </div>
                        <div className="flyer-detail-right">
                            <h2>{storeInfo.name}</h2>
                            <p><strong>소개:</strong> {storeInfo.introduce}</p>
                            <p><strong>위치:</strong> {storeInfo.location}</p>
                            <p><strong>대표 상품:</strong> {storeInfo.product}</p>
                            <p><strong>영업 시간:</strong> {storeInfo.time}</p>
                            <p><strong>휴무일:</strong> {storeInfo.rest}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;

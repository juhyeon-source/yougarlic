import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

// 기존 extractSrcFromIframe 함수는 그대로 둡니다.
const extractSrcFromIframe = (html) => {
    const match = html.match(/src=["']([^"']+)["']/);
    return match ? match[1] : html;
};

function Create() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', introduce: '', location: '', time: '', rest: '', google_map_url: '', product: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    // useEffect, handleChange는 기존과 동일
    useEffect(() => {
        let timer;
        if (isLoading) {
            setElapsedTime(0);
            timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isLoading]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "google_map_url") value = extractSrcFromIframe(value);
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: 실제 AI 이미지 생성 로직
            // const res = await fetch("http://localhost:8000/generate-flyer/image", ...);
            // const generatedData = await res.json(); // 예시

            // AI 연동 전 임시 데이터 (MyPosts 페이지로 전달할 데이터)
            const mockGeneratedFlyers = [
                { id: 'temp_flyer_1' },
                { id: 'temp_flyer_2' }
            ];

            console.log("전단지 생성 완료. /my-posts 페이지로 이동합니다.");
            
            // ★★★★★ 이동 경로를 '/my-posts'로 수정하고, 생성된 전단지 정보를 state로 전달 ★★★★★
            navigate('/my-posts', { state: { generatedFlyers: mockGeneratedFlyers } });

        } catch (err) {
            console.error("AI 생성 오류:", err);
            alert("AI 이미지 생성에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // JSX 부분과 스타일은 기존과 동일합니다.
    const inputStyle = { width: '100%', padding: '10px 15px', borderRadius: '10px', border: 'none', backgroundColor: '#f5e6ff', marginBottom: '25px', fontSize: '1rem' };
    const labelStyle = { marginBottom: '6px', fontWeight: '500' };
    const containerStyle = { maxWidth: '600px', margin: '80px auto', display: 'flex', flexDirection: 'column', padding: '0 20px' };

    return (
        <div>
            <Navbar />
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', marginBottom: '50px' }}>상점 정보 등록</h1>
                {isLoading ? (
                    <div style={{ textAlign: 'center' }}>
                        <p>AI 전단지 생성 중... ⏱️ {elapsedTime}초</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* 모든 input 필드들은 기존과 동일 */}
                        <label style={labelStyle}>상점 이름</label><input type="text" name="name" value={form.name} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>한줄 소개</label><input type="text" name="introduce" value={form.introduce} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>위치</label><input type="text" name="location" value={form.location} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>영업시간</label><input type="text" name="time" value={form.time} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>휴무일</label><input type="text" name="rest" value={form.rest} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>대표 상품</label><input type="text" name="product" value={form.product} onChange={handleChange} style={inputStyle} />
                        <label style={labelStyle}>Google Map URL</label><input type="text" name="google_map_url" value={form.google_map_url} onChange={handleChange} style={inputStyle} />
                        <div style={{ textAlign: 'center' }}>
                            <button type="submit" style={{ padding: '10px 30px', backgroundColor: '#d3b1f2', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
                                등록하기
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Create;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages 폴더에 있는 모든 컴포넌트들을 import 합니다.
// 파일 이름과 경로가 정확한지 다시 한번 확인해주세요.
import Home from './pages/Home';
import Create from './pages/Create';
import Login from './pages/Login';
import Register from './pages/Register';
import FlyerGallery from './pages/FlyerGallery';
import Board from './pages/Board';
import MyPage from './pages/MyPage';
import StoreDetail from './pages/StoreDetail';
import EditProfile from './pages/EditProfile';
// ★★★★★ 새로 만든 MyPosts 컴포넌트를 정확히 import 합니다. ★★★★★
import MyPosts from './pages/MyPosts'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 기존 경로들 */}
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/Gallery" element={<FlyerGallery />} /> 
        <Route path="/board" element={<Board />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* ★★★★★ 여기에 /my-posts 경로를 추가해야 합니다. ★★★★★ */}
        <Route path="/my-posts" element={<MyPosts />} />
      </Routes>
    </Router>
  );
}

export default App;

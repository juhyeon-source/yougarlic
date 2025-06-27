import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Create from './pages/Create';
import Login from './pages/Login';      // 추가
import Register from './pages/Register'; // 추가
import FlyerGallery from './pages/FlyerGallery';
import Board from './pages/Board';
import MyPage from './pages/MyPage';
import StoreDetail from './pages/StoreDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />         {/* 로그인 */}
        <Route path="/signup" element={<Register />} />   {/* 회원가입 */}
        <Route path="/Gallery" element={<FlyerGallery />} /> 
        <Route path="/board" element={<Board />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

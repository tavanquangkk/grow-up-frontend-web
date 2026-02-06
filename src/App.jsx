import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import WorkshopList from './features/home/WorkshopList';
import MyWorkshops from './features/home/MyWorkshops';
import Profile from './features/home/Profile';
import ChatRoom from './features/chat/ChatRoom';
import { getAccessToken, clearTokens } from './utils/token';
import { MdLogout, MdHome, MdEventNote, MdPerson, MdChatBubble } from 'react-icons/md';

const PrivateRoute = ({ children }) => {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" />;
};

// Layout component to include sidebar/navbar
const MainLayout = ({ children }) => {
  const location = useLocation();
  const handleLogout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', icon: <MdHome />, label: 'ホーム' },
    { path: '/my-workshops', icon: <MdEventNote />, label: '自分の勉強会' },
    { path: '/profile', icon: <MdPerson />, label: 'プロフィール' },
    { path: '/chat', icon: <MdChatBubble />, label: 'チャット' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Bottom Nav for Mobile */}
      <aside className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r md:flex md:flex-col">
        <div className="hidden md:flex items-center px-8 py-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md mr-3">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">GrowUp</span>
        </div>

        <nav className="flex md:flex-col justify-around md:justify-start px-2 py-3 md:px-4 md:space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col md:flex-row items-center p-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-orange-50 text-orange-600 font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl md:mr-4">{item.icon}</span>
              <span className="text-[10px] md:text-sm mt-1 md:mt-0">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center p-3 w-full text-left text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 mt-auto"
          >
            <span className="text-2xl mr-4"><MdLogout /></span>
            <span className="text-sm font-medium">ログアウト</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto max-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex justify-between items-center md:hidden">
          <span className="text-xl font-bold text-gray-800">GrowUp</span>
          <button onClick={handleLogout} className="text-gray-500"><MdLogout size={24} /></button>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

const HomePage = () => (
  <div className="space-y-8">
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">ようこそ、GrowUpへ！</h1>
        <p className="text-orange-100 text-lg max-w-xl mb-6">
          社内勉強会で新しいスキルを身につけたり、自分の知識をシェアしてチームの成長に貢献しましょう。
        </p>
        <div className="flex space-x-4">
          <Link
            to="/workshops"
            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors shadow-md"
          >
            コースを探す
          </Link>
          <button className="bg-orange-400/30 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-orange-400/40 transition-colors">
            使い方ガイド
          </button>
        </div>
      </div>
      {/* Abstract circles for design */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
    </div>

    <WorkshopList />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/workshops"
          element={
            <PrivateRoute>
              <MainLayout>
                <WorkshopList />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-workshops"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyWorkshops />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <MainLayout>
                <ChatRoom />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
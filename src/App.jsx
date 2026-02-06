import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import { getAccessToken, clearTokens } from './utils/token';
import { MdLogout, MdHome } from 'react-icons/md';

const PrivateRoute = ({ children }) => {
  const token = getAccessToken();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const handleLogout = () => {
    clearTokens();
    window.location.href = '/login';
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-gray-50 font-sans">
                {/* Navbar */}
                <nav className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <MdHome className="h-8 w-8 text-orange-500" />
                        <span className="ml-2 text-xl font-bold text-gray-800">GrowUp</span>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                        >
                          <MdLogout className="mr-2" />
                          ログアウト
                        </button>
                      </div>
                    </div>
                  </div>
                </nav>

                {/* Content */}
                <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                  <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div className="p-8 text-center">
                      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                        ようこそ、GrowUpへ！
                      </h1>
                      <p className="text-lg text-gray-600 mb-8">
                        ログインに成功しました。ここから学習を始めましょう。
                      </p>
                      <div className="inline-flex rounded-md shadow">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                        >
                          コースを探す
                        </a>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

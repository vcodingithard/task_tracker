import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import API from "./api/axios";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (cookie exists)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/auth/me"); // create this route
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="font-sans text-gray-900 antialiased min-h-screen bg-[#f9fafb] flex flex-col">

        <Routes>
          {/* If logged in → redirect to dashboard */}
          <Route
            path="/"
            element={isAuth ? <Navigate to="/dashboard" /> : <AuthPage setIsAuth={setIsAuth} />}
          />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/" />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ✅ Show footer only if logged in */}
        {isAuth && <Footer />}

      </div>
    </Router>
  );
}

export default App;